/**
 * Specification Analyzer - Analyzes microservice specifications and extracts metadata
 */

import { z } from 'zod';
import pkg from 'fs-extra';
const { readFile, pathExists } = pkg;
import * as path from 'path';
import {
  MicroserviceSpecification,
  InputAnalysisResult,
  ComplexityLevel,
  TechnologyType
} from '../types/index.js';

// Zod schemas for validation
const EndpointSchema = z.object({
  path: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  description: z.string(),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    required: z.boolean(),
    location: z.enum(['query', 'path', 'header', 'body'])
  })).optional().default([]),
  responses: z.array(z.object({
    status: z.number(),
    description: z.string(),
    schema: z.string().optional()
  })).optional().default([]),
  security: z.array(z.string()).optional()
});

const DatabaseSchema = z.object({
  type: z.enum(['oracle', 'mysql', 'postgresql', 'mongodb', 'mssql']),
  version: z.string().optional(),
  connectionType: z.enum(['direct', 'pool', 'jndi']),
  procedures: z.array(z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.array(z.object({
      name: z.string(),
      type: z.string(),
      direction: z.enum(['IN', 'OUT', 'INOUT'])
    }))
  })).optional().default([])
});

const IntegrationSchema = z.object({
  type: z.enum(['rest', 'soap', 'stored-procedure', 'message-queue', 'event']),
  name: z.string(),
  description: z.string(),
  configuration: z.record(z.any())
});

const SecuritySchema = z.object({
  authentication: z.enum(['jwt', 'oauth2', 'basic', 'none']),
  authorization: z.enum(['rbac', 'abac', 'none']),
  requirements: z.array(z.string()).default([])
});

const MicroserviceSpecSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  endpoints: z.array(EndpointSchema),
  database: DatabaseSchema,
  integrations: z.array(IntegrationSchema).default([]),
  security: SecuritySchema,
  architecture: z.enum(['clean', 'layered', 'hexagonal', 'mvc', 'event-driven']),
  complexity: z.enum(['low', 'medium', 'high', 'very-high']).optional()
});

export class SpecificationAnalyzer {
  private static readonly COMPLEXITY_WEIGHTS = {
    endpoints: 2,
    database_procedures: 3,
    integrations: 4,
    security_requirements: 2,
    architecture_complexity: 1
  };

  async analyzeSpecification(specificationPath: string): Promise<InputAnalysisResult> {
    try {
      console.error(`[DEBUG] Analyzing specification at: ${specificationPath}`);
      
      // Normalize path for Windows compatibility
      const normalizedPath = path.resolve(specificationPath);
      console.error(`[DEBUG] Normalized path: ${normalizedPath}`);
      
      // Read and parse specification file with proper error handling
      let specFile: string;
      try {
        specFile = await readFile(normalizedPath, 'utf-8');
        console.error(`[DEBUG] File read successfully, length: ${specFile.length}`);
      } catch (error) {
        console.error(`[DEBUG] Failed to read file: ${error}`);
        throw new Error(`Failed to read specification file at ${normalizedPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      let specData: any;
      try {
        specData = JSON.parse(specFile);
        console.error(`[DEBUG] JSON parsed successfully`);
      } catch (error) {
        console.error(`[DEBUG] JSON parse error: ${error}`);
        throw new Error(`Invalid JSON in specification file: ${error instanceof Error ? error.message : 'Malformed JSON'}`);
      }
      
      // Validate against schema
      try {
        const specification = MicroserviceSpecSchema.parse(specData) as MicroserviceSpecification;
        console.error(`[DEBUG] Schema validation successful`);
      } catch (error) {
        console.error(`[DEBUG] Schema validation failed: ${error}`);
        throw error;
      }
      
      const specification = MicroserviceSpecSchema.parse(specData) as MicroserviceSpecification;
      
      // Calculate complexity score
      const complexityScore = this.calculateComplexityScore(specification);
      
      // Determine estimated effort
      const estimatedEffort = this.determineEstimatedEffort(complexityScore);
      
      return {
        specificationFile: normalizedPath,
        specificationValid: true,
        microserviceName: specification.name,
        complexityScore,
        estimatedEffort
      };
    } catch (error) {
      console.error('Error analyzing specification:', error);
      
      return {
        specificationFile: specificationPath,
        specificationValid: false,
        microserviceName: 'unknown',
        complexityScore: 0,
        estimatedEffort: 'unknown'
      };
    }
  }

  private calculateComplexityScore(spec: MicroserviceSpecification): number {
    let score = 0;
    
    // Endpoints complexity
    score += spec.endpoints.length * SpecificationAnalyzer.COMPLEXITY_WEIGHTS.endpoints;
    
    // Add complexity for endpoints with multiple parameters
    spec.endpoints.forEach(endpoint => {
      score += endpoint.parameters.length * 0.5;
      score += endpoint.responses.length * 0.3;
      if (endpoint.security && endpoint.security.length > 0) {
        score += 1;
      }
    });
    
    // Database complexity
    if (spec.database.procedures && spec.database.procedures.length > 0) {
      score += spec.database.procedures.length * SpecificationAnalyzer.COMPLEXITY_WEIGHTS.database_procedures;
      
      // Add complexity for procedure parameters
      spec.database.procedures.forEach(proc => {
        score += proc.parameters.length * 0.5;
      });
    }
    
    // Integration complexity
    score += spec.integrations.length * SpecificationAnalyzer.COMPLEXITY_WEIGHTS.integrations;
    
    // Security complexity
    score += spec.security.requirements.length * SpecificationAnalyzer.COMPLEXITY_WEIGHTS.security_requirements;
    
    if (spec.security.authentication !== 'none') {
      score += 2;
    }
    
    if (spec.security.authorization !== 'none') {
      score += 2;
    }
    
    // Architecture complexity
    const architectureComplexity = {
      'mvc': 1,
      'layered': 2,
      'clean': 3,
      'hexagonal': 3,
      'event-driven': 4
    };
    
    score += architectureComplexity[spec.architecture] * SpecificationAnalyzer.COMPLEXITY_WEIGHTS.architecture_complexity;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  }

  private determineEstimatedEffort(complexityScore: number): string {
    if (complexityScore <= 5) return 'low';
    if (complexityScore <= 15) return 'medium';
    if (complexityScore <= 30) return 'high';
    return 'very-high';
  }

  async validateSpecificationFile(filePath: string): Promise<boolean> {
    try {
      if (!await pathExists(filePath)) {
        return false;
      }
      
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      MicroserviceSpecSchema.parse(data);
      return true;
    } catch (error) {
      console.error('Specification validation failed:', error);
      return false;
    }
  }

  async extractSpecificationMetadata(specification: MicroserviceSpecification): Promise<{
    databaseType: string;
    endpointsCount: number;
    integrationsCount: number;
    securityRequirements: string[];
    complexityFactors: string[];
  }> {
    const complexityFactors: string[] = [];
    
    // Analyze complexity factors
    if (specification.database.procedures && specification.database.procedures.length > 0) {
      complexityFactors.push(`${specification.database.type.toUpperCase()} stored procedure integration`);
    }
    
    if (specification.integrations.length > 0) {
      complexityFactors.push('Legacy system mapping');
    }
    
    if (specification.security.requirements.length > 0) {
      complexityFactors.push('Enterprise security requirements');
    }
    
    if (specification.endpoints.length > 5) {
      complexityFactors.push('Multiple API endpoints');
    }
    
    return {
      databaseType: specification.database.type,
      endpointsCount: specification.endpoints.length,
      integrationsCount: specification.integrations.length,
      securityRequirements: specification.security.requirements,
      complexityFactors
    };
  }

  async suggestTechnologiesForSpec(specification: MicroserviceSpecification): Promise<{
    nodejs: { compatibility: number; reasons: string[] };
    springboot: { compatibility: number; reasons: string[] };
  }> {
    const nodejsReasons: string[] = [];
    const springbootReasons: string[] = [];
    
    let nodejsScore = 70; // Base score
    let springbootScore = 70; // Base score
    
    // Database compatibility
    if (specification.database.type === 'oracle') {
      springbootScore += 15;
      springbootReasons.push('Excellent Oracle support with Spring Data JPA');
      nodejsReasons.push('Requires manual Oracle driver configuration');
    } else if (['mysql', 'postgresql'].includes(specification.database.type)) {
      nodejsScore += 10;
      springbootScore += 10;
      nodejsReasons.push(`Good ${specification.database.type} ecosystem support`);
      springbootReasons.push(`Mature ${specification.database.type} integration`);
    }
    
    // Stored procedures
    if (specification.database.procedures && specification.database.procedures.length > 0) {
      springbootScore += 10;
      springbootReasons.push('Native stored procedure support');
      nodejsScore -= 5;
      nodejsReasons.push('Limited stored procedure tooling');
    }
    
    // Security requirements
    if (specification.security.authentication === 'jwt') {
      nodejsScore += 8;
      springbootScore += 10;
      nodejsReasons.push('Excellent JWT library ecosystem');
      springbootReasons.push('Spring Security JWT integration');
    }
    
    if (specification.security.authorization === 'rbac') {
      springbootScore += 8;
      springbootReasons.push('Built-in RBAC with Spring Security');
      nodejsReasons.push('Requires custom RBAC implementation');
    }
    
    // Architecture patterns
    if (specification.architecture === 'clean') {
      nodejsScore += 5;
      springbootScore += 8;
      nodejsReasons.push('Good clean architecture patterns');
      springbootReasons.push('Mature clean architecture frameworks');
    }
    
    // Integration complexity
    if (specification.integrations.length > 2) {
      springbootScore += 5;
      springbootReasons.push('Enterprise integration patterns');
    }
    
    // Endpoint complexity
    if (specification.endpoints.length > 10) {
      springbootScore += 5;
      springbootReasons.push('Better for complex API management');
    } else if (specification.endpoints.length <= 3) {
      nodejsScore += 5;
      nodejsReasons.push('Perfect for simple REST APIs');
    }
    
    return {
      nodejs: {
        compatibility: Math.min(100, Math.max(0, nodejsScore)),
        reasons: nodejsReasons
      },
      springboot: {
        compatibility: Math.min(100, Math.max(0, springbootScore)),
        reasons: springbootReasons
      }
    };
  }
}
