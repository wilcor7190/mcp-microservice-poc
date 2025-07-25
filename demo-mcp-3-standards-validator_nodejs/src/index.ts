#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';

import { NodeJSStandards } from './standards/nodejs-standards.js';
import { 
  NodeJSProject, 
  PackageJsonInfo, 
  NodeJSFramework, 
  NodeJSValidationReport,
  CategoryReport,
  ValidationSummary,
  Recommendation,
  ValidationCategory,
  StandardsConfig
} from './types/index.js';

const server = new Server(
  {
    name: 'nodejs-standards-validator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const nodeJSStandards = new NodeJSStandards();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'validate-microservice',
        description: 'Valida un microservicio Node.js/NestJS contra estándares de desarrollo específicos',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta al microservicio Node.js a validar (debe ser ruta absoluta)',
            },
            standards: {
              type: 'object',
              description: 'Configuración de estándares a validar',
              properties: {
                security: { type: 'boolean', description: 'Validar estándares de seguridad', default: true },
                testing: { type: 'boolean', description: 'Validar tests unitarios y cobertura', default: true },
                coverage: { type: 'boolean', description: 'Validar cobertura de código', default: true },
                codeQuality: { type: 'boolean', description: 'Validar calidad de código', default: true },
                documentation: { type: 'boolean', description: 'Validar documentación', default: true },
                performance: { type: 'boolean', description: 'Validar aspectos de rendimiento', default: true }
              }
            },
            outputPath: {
              type: 'string',
              description: 'Ruta donde guardar el reporte de validación (opcional)',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'analyze-project',
        description: 'Analiza un proyecto Node.js y extrae información técnica',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta al proyecto Node.js a analizar',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'get-standards',
        description: 'Obtiene la lista completa de estándares de Node.js organizados por categoría',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'validate-category',
        description: 'Valida una categoría específica de estándares',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta al proyecto Node.js',
            },
            category: {
              type: 'string',
              enum: ['security', 'testing', 'codeQuality', 'documentation', 'performance'],
              description: 'Categoría de estándares a validar',
            },
          },
          required: ['projectPath', 'category'],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'validate-microservice': {
        const { projectPath, standards, outputPath } = args as {
          projectPath: string;
          standards?: StandardsConfig;
          outputPath?: string;
        };

        console.error(`[NodeJS Validator] Validando microservicio: ${projectPath}`);

        if (!(await directoryExists(projectPath))) {
          throw new McpError(ErrorCode.InvalidParams, `El directorio no existe: ${projectPath}`);
        }

        const project = await analyzeNodeJSProject(projectPath);
        const validationReport = await validateProject(project, standards);

        // Guardar reporte si se especifica outputPath
        if (outputPath) {
          await saveValidationReport(validationReport, outputPath);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(validationReport, null, 2),
            },
          ],
        };
      }

      case 'analyze-project': {
        const { projectPath } = args as { projectPath: string };

        console.error(`[NodeJS Validator] Analizando proyecto: ${projectPath}`);

        if (!(await directoryExists(projectPath))) {
          throw new McpError(ErrorCode.InvalidParams, `El directorio no existe: ${projectPath}`);
        }

        const project = await analyzeNodeJSProject(projectPath);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                project: {
                  name: project.name,
                  framework: project.framework,
                  hasTypeScript: project.hasTypeScript,
                  testFramework: project.testFramework,
                  packageInfo: {
                    version: project.packageJson.version,
                    description: project.packageJson.description,
                    scripts: Object.keys(project.packageJson.scripts),
                    dependencyCount: Object.keys(project.packageJson.dependencies).length,
                    devDependencyCount: Object.keys(project.packageJson.devDependencies).length
                  }
                }
              }, null, 2),
            },
          ],
        };
      }

      case 'get-standards': {
        console.error(`[NodeJS Validator] Obteniendo estándares Node.js`);

        const allRules = nodeJSStandards.getAllRules();
        const categoryWeights = nodeJSStandards.getCategoryWeights();
        const thresholds = nodeJSStandards.getScoreThresholds();

        const standardsInfo = {
          categories: {} as any,
          weights: Object.fromEntries(categoryWeights),
          thresholds,
          totalRules: 0
        };

        for (const [category, rules] of allRules) {
          standardsInfo.categories[category] = {
            name: category,
            ruleCount: rules.length,
            weight: categoryWeights.get(category),
            rules: rules.map(rule => ({
              id: rule.id,
              name: rule.name,
              description: rule.description,
              severity: rule.severity
            }))
          };
          standardsInfo.totalRules += rules.length;
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                standards: standardsInfo
              }, null, 2),
            },
          ],
        };
      }

      case 'validate-category': {
        const { projectPath, category } = args as {
          projectPath: string;
          category: ValidationCategory;
        };

        console.error(`[NodeJS Validator] Validando categoría ${category}: ${projectPath}`);

        if (!(await directoryExists(projectPath))) {
          throw new McpError(ErrorCode.InvalidParams, `El directorio no existe: ${projectPath}`);
        }

        const project = await analyzeNodeJSProject(projectPath);
        const categoryReport = await validateCategory(project, category);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                category,
                report: categoryReport
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[NodeJS Validator] Error en herramienta ${name}:`, error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Error ejecutando ${name}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// Funciones auxiliares

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function analyzeNodeJSProject(projectPath: string): Promise<NodeJSProject> {
  console.error(`[NodeJS Validator] Analizando proyecto en: ${projectPath}`);

  // Leer package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  let packageJson: PackageJsonInfo;
  
  try {
    const packageContent = await fs.readFile(packageJsonPath, 'utf-8');
    const parsedPackage = JSON.parse(packageContent);
    
    packageJson = {
      name: parsedPackage.name || path.basename(projectPath),
      version: parsedPackage.version || '1.0.0',
      description: parsedPackage.description,
      scripts: parsedPackage.scripts || {},
      dependencies: parsedPackage.dependencies || {},
      devDependencies: parsedPackage.devDependencies || {},
      main: parsedPackage.main,
      type: parsedPackage.type
    };
  } catch (error) {
    throw new Error(`No se pudo leer package.json: ${error}`);
  }

  // Detectar framework
  const framework = detectFramework(packageJson);
  
  // Verificar TypeScript
  const hasTypeScript = await checkTypeScript(projectPath, packageJson);
  
  // Detectar framework de testing
  const testFramework = detectTestFramework(packageJson);

  return {
    name: packageJson.name,
    path: projectPath,
    packageJson,
    framework,
    hasTypeScript,
    testFramework
  };
}

function detectFramework(packageJson: PackageJsonInfo): NodeJSFramework {
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['@nestjs/core'] || deps['@nestjs/common']) {
    return 'nestjs';
  }
  
  if (deps['express']) {
    return 'express';
  }
  
  if (deps['fastify']) {
    return 'fastify';
  }
  
  if (deps['koa']) {
    return 'koa';
  }
  
  return 'vanilla';
}

async function checkTypeScript(projectPath: string, packageJson: PackageJsonInfo): Promise<boolean> {
  // Verificar dependencias
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['typescript']) {
    return true;
  }
  
  // Verificar archivo tsconfig.json
  try {
    await fs.access(path.join(projectPath, 'tsconfig.json'));
    return true;
  } catch {
    return false;
  }
}

function detectTestFramework(packageJson: PackageJsonInfo): string | undefined {
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['jest'] || deps['@nestjs/testing']) {
    return 'jest';
  }
  
  if (deps['mocha']) {
    return 'mocha';
  }
  
  if (deps['vitest']) {
    return 'vitest';
  }
  
  return undefined;
}

async function validateProject(
  project: NodeJSProject, 
  standardsConfig?: StandardsConfig
): Promise<NodeJSValidationReport> {
  const startTime = Date.now();
  
  console.error(`[NodeJS Validator] Ejecutando validación completa para: ${project.name}`);
  
  const config = standardsConfig || {
    security: true,
    testing: true,
    coverage: true,
    codeQuality: true,
    documentation: true,
    performance: true
  };

  const allRules = nodeJSStandards.getAllRules();
  const categoryWeights = nodeJSStandards.getCategoryWeights();
  const categoryReports: CategoryReport[] = [];
  
  // Validar cada categoría habilitada
  for (const [category, rules] of allRules) {
    if (!config[category]) {
      console.error(`[NodeJS Validator] Saltando categoría: ${category}`);
      continue;
    }
    
    const categoryReport = await validateCategory(project, category);
    categoryReports.push(categoryReport);
  }
  
  // Calcular score general
  const overallScore = calculateOverallScore(categoryReports, categoryWeights);
  const thresholds = nodeJSStandards.getScoreThresholds();
  
  const overallStatus = overallScore >= thresholds.passed ? 'PASSED' :
                       overallScore >= thresholds.warning ? 'WARNING' : 'FAILED';
  
  // Generar recomendaciones
  const recommendations = generateRecommendations(categoryReports);
  
  // Crear resumen
  const summary = createValidationSummary(categoryReports);
  
  const executionTime = Date.now() - startTime;
  
  console.error(`[NodeJS Validator] Validación completada en ${executionTime}ms - Score: ${overallScore}`);
  
  return {
    project,
    timestamp: new Date().toISOString(),
    overallScore,
    overallStatus,
    categories: categoryReports,
    recommendations,
    summary,
    executionTime
  };
}

async function validateCategory(
  project: NodeJSProject, 
  category: ValidationCategory
): Promise<CategoryReport> {
  console.error(`[NodeJS Validator] Validando categoría: ${category}`);
  
  const allRules = nodeJSStandards.getAllRules();
  const categoryRules = allRules.get(category) || [];
  const categoryWeights = nodeJSStandards.getCategoryWeights();
  
  const ruleReports = [];
  let totalScore = 0;
  
  for (const rule of categoryRules) {
    try {
      console.error(`[NodeJS Validator] Ejecutando regla: ${rule.id} - ${rule.name}`);
      const result = await rule.validator(project);
      
      ruleReports.push({
        rule,
        result
      });
      
      totalScore += result.score;
      
    } catch (error) {
      console.error(`[NodeJS Validator] Error en regla ${rule.id}:`, error);
      
      ruleReports.push({
        rule,
        result: {
          status: 'SKIPPED' as const,
          message: `Error ejecutando regla: ${error}`,
          score: 0,
          suggestions: ['Verificar configuración de la regla']
        }
      });
    }
  }
  
  const categoryScore = categoryRules.length > 0 ? totalScore / categoryRules.length : 0;
  const categoryStatus = categoryScore >= 80 ? 'PASSED' :
                        categoryScore >= 60 ? 'WARNING' : 'FAILED';
  
  return {
    name: category,
    score: Math.round(categoryScore),
    status: categoryStatus,
    rules: ruleReports,
    weight: categoryWeights.get(category) || 0
  };
}

function calculateOverallScore(
  categoryReports: CategoryReport[], 
  categoryWeights: Map<ValidationCategory, number>
): number {
  let weightedScore = 0;
  let totalWeight = 0;
  
  for (const report of categoryReports) {
    const weight = categoryWeights.get(report.name) || 0;
    weightedScore += report.score * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
}

function generateRecommendations(categoryReports: CategoryReport[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  for (const categoryReport of categoryReports) {
    if (categoryReport.status === 'FAILED') {
      // Agregar recomendaciones de alta prioridad para categorías fallidas
      const failedRules = categoryReport.rules.filter(r => r.result.status === 'FAILED');
      
      for (const ruleReport of failedRules.slice(0, 2)) { // Máximo 2 por categoría
        if (ruleReport.result.suggestions && ruleReport.result.suggestions.length > 0) {
          recommendations.push({
            priority: 'HIGH',
            category: categoryReport.name,
            title: `Corregir: ${ruleReport.rule.name}`,
            description: ruleReport.result.message || ruleReport.rule.description,
            action: ruleReport.result.suggestions[0],
            impact: 'Mejora la conformidad con estándares de desarrollo',
            effort: ruleReport.rule.severity === 'ERROR' ? 'High' : 'Medium'
          });
        }
      }
    } else if (categoryReport.status === 'WARNING') {
      // Agregar recomendaciones de prioridad media para warnings
      const warningRules = categoryReport.rules.filter(r => r.result.status === 'WARNING' || r.result.status === 'FAILED');
      
      for (const ruleReport of warningRules.slice(0, 1)) { // Máximo 1 por categoría
        if (ruleReport.result.suggestions && ruleReport.result.suggestions.length > 0) {
          recommendations.push({
            priority: 'MEDIUM',
            category: categoryReport.name,
            title: `Mejorar: ${ruleReport.rule.name}`,
            description: ruleReport.result.message || ruleReport.rule.description,
            action: ruleReport.result.suggestions[0],
            impact: 'Optimiza la calidad del código',
            effort: 'Medium'
          });
        }
      }
    }
  }
  
  // Limitar a máximo 10 recomendaciones
  return recommendations.slice(0, 10);
}

function createValidationSummary(categoryReports: CategoryReport[]): ValidationSummary {
  let totalRules = 0;
  let passedRules = 0;
  let failedRules = 0;
  let warningRules = 0;
  let skippedRules = 0;
  let securityIssues = 0;
  let performanceIssues = 0;
  let lintErrors = 0;
  let testFiles = 0;
  
  for (const categoryReport of categoryReports) {
    for (const ruleReport of categoryReport.rules) {
      totalRules++;
      
      switch (ruleReport.result.status) {
        case 'PASSED':
          passedRules++;
          break;
        case 'FAILED':
          failedRules++;
          if (categoryReport.name === 'security') securityIssues++;
          if (categoryReport.name === 'performance') performanceIssues++;
          break;
        case 'WARNING':
          warningRules++;
          break;
        case 'SKIPPED':
          skippedRules++;
          break;
      }
    }
  }
  
  return {
    totalRules,
    passedRules,
    failedRules,
    warningRules,
    skippedRules,
    securityIssues,
    performanceIssues,
    lintErrors,
    testFiles
  };
}

async function saveValidationReport(report: NodeJSValidationReport, outputPath: string): Promise<void> {
  try {
    await fs.mkdir(outputPath, { recursive: true });
    
    const reportFileName = `nodejs-validation-report-${report.project.name}-${Date.now()}.json`;
    const fullPath = path.join(outputPath, reportFileName);
    
    await fs.writeFile(fullPath, JSON.stringify(report, null, 2), 'utf-8');
    console.error(`[NodeJS Validator] Reporte guardado en: ${fullPath}`);
  } catch (error) {
    console.error(`[NodeJS Validator] Error guardando reporte:`, error);
  }
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[NodeJS Validator] Servidor MCP Node.js Standards Validator iniciado');
}

main().catch((error) => {
  console.error('[NodeJS Validator] Error fatal:', error);
  process.exit(1);
});