/**
 * Repository Analyzer - Analyzes reference repositories and calculates compatibility scores
 */

import pkg from 'fs-extra';
const { readFile, pathExists, readdir, stat } = pkg;
import * as path from 'path';
import {
  RepositoryInfo,
  RepositoryAnalysisResult,
  TechnologyType,
  MicroserviceSpecification
} from '../types/index.js';

export class RepositoryAnalyzer {
  private static readonly NODEJS_PATTERNS = [
    'express',
    'fastify',
    'nest',
    'typescript',
    'jest',
    'oracle',
    'clean-architecture',
    'layered-architecture',
    'rest-api',
    'jwt',
    'auth',
    'middleware'
  ];

  private static readonly SPRINGBOOT_PATTERNS = [
    'spring-boot',
    'spring-data',
    'spring-security',
    'jpa',
    'hibernate',
    'oracle',
    'maven',
    'gradle',
    'junit',
    'clean-architecture',
    'layered-architecture',
    'rest-controller',
    'repository-pattern'
  ];

  async analyzeRepositories(referencePath: string, specification: MicroserviceSpecification): Promise<{
    nodejs: RepositoryAnalysisResult;
    springboot: RepositoryAnalysisResult;
  }> {
    const normalizedReferencePath = path.resolve(referencePath);
    const nodejsPath = path.resolve(normalizedReferencePath, 'nodejs-repos');
    const springbootPath = path.resolve(normalizedReferencePath, 'springboot-repos');

    const [nodejsResult, springbootResult] = await Promise.all([
      this.analyzeRepositoriesForTechnology(nodejsPath, 'nodejs', specification),
      this.analyzeRepositoriesForTechnology(springbootPath, 'springboot', specification)
    ]);

    return {
      nodejs: nodejsResult,
      springboot: springbootResult
    };
  }

  private async analyzeRepositoriesForTechnology(
    repositoryPath: string,
    technology: TechnologyType,
    specification: MicroserviceSpecification
  ): Promise<RepositoryAnalysisResult> {
    try {
      if (!await pathExists(repositoryPath)) {
        return this.createEmptyResult(technology);
      }

      const repositoryDirs = await readdir(repositoryPath);
      const repositories: RepositoryInfo[] = [];

      for (const dir of repositoryDirs) {
        const fullPath = path.join(repositoryPath, dir);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          const repoInfo = await this.analyzeRepository(fullPath, technology, specification);
          if (repoInfo) {
            repositories.push(repoInfo);
          }
        }
      }

      return this.calculateAnalysisResult(repositories, technology);
    } catch (error) {
      console.error(`Error analyzing ${technology} repositories:`, error);
      return this.createEmptyResult(technology);
    }
  }

  private async analyzeRepository(
    repositoryPath: string,
    technology: TechnologyType,
    specification: MicroserviceSpecification
  ): Promise<RepositoryInfo | null> {
    try {
      const repoName = path.basename(repositoryPath);
      const stats = await stat(repositoryPath);
      
      // Analyze repository structure and patterns
      const patterns = await this.detectPatterns(repositoryPath, technology);
      const compatibility = this.calculateCompatibility(patterns, specification, technology);
      const description = await this.generateDescription(repositoryPath, patterns, technology);

      return {
        name: repoName,
        path: repositoryPath,
        technology,
        patterns,
        compatibility,
        description,
        lastModified: stats.mtime,
        size: await this.calculateDirectorySize(repositoryPath)
      };
    } catch (error) {
      console.error(`Error analyzing repository ${repositoryPath}:`, error);
      return null;
    }
  }

  private async detectPatterns(repositoryPath: string, technology: TechnologyType): Promise<string[]> {
    const patterns: string[] = [];
    const patternKeywords = technology === 'nodejs' 
      ? RepositoryAnalyzer.NODEJS_PATTERNS 
      : RepositoryAnalyzer.SPRINGBOOT_PATTERNS;

    try {
      // Check for package.json or pom.xml/build.gradle
      const configFiles = technology === 'nodejs' 
        ? ['package.json', 'package-lock.json', 'yarn.lock']
        : ['pom.xml', 'build.gradle', 'build.gradle.kts'];

      for (const configFile of configFiles) {
        const configPath = path.join(repositoryPath, configFile);
        if (await pathExists(configPath)) {
          const content = await readFile(configPath, 'utf-8');
          
          // Analyze dependencies and configuration
          for (const pattern of patternKeywords) {
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
              patterns.push(pattern);
            }
          }
        }
      }

      // Check source code structure
      const srcStructure = await this.analyzeSourceStructure(repositoryPath, technology);
      patterns.push(...srcStructure);

      // Check for architecture patterns
      const archPatterns = await this.detectArchitecturePatterns(repositoryPath);
      patterns.push(...archPatterns);

      // Remove duplicates
      return Array.from(new Set(patterns));
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return patterns;
    }
  }

  private async analyzeSourceStructure(repositoryPath: string, technology: TechnologyType): Promise<string[]> {
    const patterns: string[] = [];
    
    try {
      const srcPath = technology === 'nodejs' 
        ? path.join(repositoryPath, 'src')
        : path.join(repositoryPath, 'src', 'main', 'java');

      if (await pathExists(srcPath)) {
        const structure = await this.getDirectoryStructure(srcPath);
        
        // Check for common directory patterns
        if (structure.includes('controllers') || structure.includes('controller')) {
          patterns.push('mvc-pattern');
        }
        
        if (structure.includes('services') || structure.includes('service')) {
          patterns.push('service-layer');
        }
        
        if (structure.includes('repositories') || structure.includes('repository')) {
          patterns.push('repository-pattern');
        }
        
        if (structure.includes('entities') || structure.includes('models')) {
          patterns.push('entity-mapping');
        }
        
        if (structure.includes('dto') || structure.includes('dtos')) {
          patterns.push('dto-pattern');
        }
        
        if (technology === 'nodejs' && structure.includes('middleware')) {
          patterns.push('middleware-pattern');
        }
        
        if (technology === 'springboot' && structure.includes('config')) {
          patterns.push('configuration-management');
        }
      }
    } catch (error) {
      console.error('Error analyzing source structure:', error);
    }
    
    return patterns;
  }

  private async detectArchitecturePatterns(repositoryPath: string): Promise<string[]> {
    const patterns: string[] = [];
    
    try {
      const structure = await this.getDirectoryStructure(repositoryPath);
      const allFiles = await this.getAllFiles(repositoryPath);
      
      // Check for clean architecture
      if (structure.includes('domain') && structure.includes('infrastructure') && structure.includes('application')) {
        patterns.push('clean-architecture');
      }
      
      // Check for hexagonal architecture
      if (structure.includes('adapters') && structure.includes('ports')) {
        patterns.push('hexagonal-architecture');
      }
      
      // Check for layered architecture
      if (structure.includes('presentation') && structure.includes('business') && structure.includes('data')) {
        patterns.push('layered-architecture');
      }
      
      // Check for specific technology patterns
      if (allFiles.some(file => file.includes('test') || file.includes('spec'))) {
        patterns.push('test-coverage');
      }
      
      if (allFiles.some(file => file.includes('docker'))) {
        patterns.push('containerization');
      }
      
    } catch (error) {
      console.error('Error detecting architecture patterns:', error);
    }
    
    return patterns;
  }

  private calculateCompatibility(
    patterns: string[],
    specification: MicroserviceSpecification,
    technology: TechnologyType
  ): number {
    let score = 50; // Base score

    // Database compatibility
    if (specification.database.type === 'oracle') {
      if (patterns.includes('oracle')) {
        score += technology === 'springboot' ? 20 : 15;
      }
    }

    // Architecture compatibility
    if (patterns.includes(specification.architecture)) {
      score += 15;
    }

    // Security patterns
    if (specification.security.authentication === 'jwt' && patterns.includes('jwt')) {
      score += 10;
    }

    // Repository pattern for database access
    if (specification.database.procedures && specification.database.procedures.length > 0) {
      if (patterns.includes('repository-pattern')) {
        score += 10;
      }
    }

    // REST API patterns
    if (patterns.includes('rest-api') || patterns.includes('mvc-pattern')) {
      score += 10;
    }

    // Testing patterns
    if (patterns.includes('test-coverage')) {
      score += 5;
    }

    // Containerization
    if (patterns.includes('containerization')) {
      score += 5;
    }

    // Technology-specific bonuses
    if (technology === 'nodejs') {
      if (patterns.includes('typescript')) score += 5;
      if (patterns.includes('express') || patterns.includes('fastify')) score += 5;
    } else if (technology === 'springboot') {
      if (patterns.includes('spring-data')) score += 10;
      if (patterns.includes('spring-security')) score += 8;
    }

    return Math.min(100, Math.max(0, score));
  }

  private async generateDescription(repositoryPath: string, patterns: string[], technology: TechnologyType): Promise<string> {
    const repoName = path.basename(repositoryPath);
    const mainPatterns = patterns.slice(0, 3);
    
    return `${technology.toUpperCase()} repository with ${mainPatterns.join(', ')} patterns`;
  }

  private calculateAnalysisResult(repositories: RepositoryInfo[], technology: TechnologyType): RepositoryAnalysisResult {
    if (repositories.length === 0) {
      return this.createEmptyResult(technology);
    }

    const averageCompatibility = repositories.reduce((sum, repo) => sum + repo.compatibility, 0) / repositories.length;
    const bestMatch = repositories.reduce((best, current) => 
      current.compatibility > best.compatibility ? current : best
    );

    const allPatterns = Array.from(new Set(repositories.flatMap(repo => repo.patterns)));
    
    const strengths = this.generateStrengths(allPatterns, technology);
    const weaknesses = this.generateWeaknesses(allPatterns, technology);

    return {
      repositories,
      averageCompatibility: Math.round(averageCompatibility),
      bestMatch,
      patterns: allPatterns,
      strengths,
      weaknesses
    };
  }

  private createEmptyResult(technology: TechnologyType): RepositoryAnalysisResult {
    return {
      repositories: [],
      averageCompatibility: 0,
      bestMatch: null,
      patterns: [],
      strengths: [],
      weaknesses: [`No ${technology} repositories found`]
    };
  }

  private generateStrengths(patterns: string[], technology: TechnologyType): string[] {
    const strengths: string[] = [];
    
    if (technology === 'nodejs') {
      if (patterns.includes('typescript')) strengths.push('Strong TypeScript support');
      if (patterns.includes('express')) strengths.push('Express.js ecosystem');
      if (patterns.includes('clean-architecture')) strengths.push('Clean architecture patterns');
      if (patterns.includes('test-coverage')) strengths.push('Good test coverage');
    } else {
      if (patterns.includes('spring-data')) strengths.push('Spring Data JPA integration');
      if (patterns.includes('spring-security')) strengths.push('Spring Security framework');
      if (patterns.includes('oracle')) strengths.push('Oracle database expertise');
      if (patterns.includes('clean-architecture')) strengths.push('Enterprise architecture patterns');
    }
    
    return strengths;
  }

  private generateWeaknesses(patterns: string[], technology: TechnologyType): string[] {
    const weaknesses: string[] = [];
    
    if (technology === 'nodejs') {
      if (!patterns.includes('oracle')) weaknesses.push('Limited Oracle integration examples');
      if (!patterns.includes('test-coverage')) weaknesses.push('Missing test patterns');
    } else {
      if (!patterns.includes('test-coverage')) weaknesses.push('Limited testing examples');
      if (!patterns.includes('containerization')) weaknesses.push('Missing Docker configurations');
    }
    
    return weaknesses;
  }

  private async getDirectoryStructure(dirPath: string): Promise<string[]> {
    try {
      const items = await readdir(dirPath);
      const directories: string[] = [];
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stats = await stat(fullPath);
        if (stats.isDirectory()) {
          directories.push(item);
        }
      }
      
      return directories;
    } catch (error) {
      return [];
    }
  }

  private async getAllFiles(dirPath: string): Promise<string[]> {
    try {
      const files: string[] = [];
      
      const walk = async (currentPath: string) => {
        const items = await readdir(currentPath);
        
        for (const item of items) {
          const fullPath = path.join(currentPath, item);
          const stats = await stat(fullPath);
          
          if (stats.isDirectory()) {
            await walk(fullPath);
          } else {
            files.push(fullPath);
          }
        }
      };
      
      await walk(dirPath);
      return files;
    } catch (error) {
      return [];
    }
  }

  private async calculateDirectorySize(dirPath: string): Promise<number> {
    try {
      let size = 0;
      
      const walk = async (currentPath: string) => {
        const items = await readdir(currentPath);
        
        for (const item of items) {
          const fullPath = path.join(currentPath, item);
          const stats = await stat(fullPath);
          
          if (stats.isDirectory()) {
            await walk(fullPath);
          } else {
            size += stats.size;
          }
        }
      };
      
      await walk(dirPath);
      return size;
    } catch (error) {
      return 0;
    }
  }
}
