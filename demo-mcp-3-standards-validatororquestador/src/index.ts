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

import { StandardsOrchestrator } from './orchestrator/standards-orchestrator.js';
import { TechnologyDetector } from './detectors/technology-detector.js';
import { ValidationRequest, StandardsConfig } from './types/index.js';

const server = new Server(
  {
    name: 'standards-validation-orchestrator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const orchestrator = new StandardsOrchestrator();
const technologyDetector = new TechnologyDetector();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'validate-microservice',
        description: 'Valida un microservicio completo contra estándares de desarrollo - delega según tecnología detectada',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta al microservicio a validar (debe ser ruta absoluta)',
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
        name: 'detect-technology',
        description: 'Detecta la tecnología de un microservicio (Node.js, Java, .NET)',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Ruta al microservicio para detectar tecnología',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'list-validators',
        description: 'Lista todos los validadores MCP disponibles por tecnología',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'validate-batch',
        description: 'Valida múltiples microservicios en una carpeta',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: 'Ruta a la carpeta que contiene múltiples microservicios',
            },
            outputPath: {
              type: 'string',
              description: 'Ruta donde guardar los reportes de validación',
            },
            standards: {
              type: 'object',
              description: 'Configuración de estándares a validar',
              properties: {
                security: { type: 'boolean', default: true },
                testing: { type: 'boolean', default: true },
                coverage: { type: 'boolean', default: true },
                codeQuality: { type: 'boolean', default: true },
                documentation: { type: 'boolean', default: true },
                performance: { type: 'boolean', default: true }
              }
            }
          },
          required: ['inputPath', 'outputPath'],
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

        console.error(`[Orchestrator] Validando microservicio: ${projectPath}`);

        // Verificar que el directorio existe
        if (!(await directoryExists(projectPath))) {
          throw new McpError(ErrorCode.InvalidParams, `El directorio no existe: ${projectPath}`);
        }

        const validationRequest: ValidationRequest = {
          projectPath,
          standards: standards || {
            security: true,
            testing: true,
            coverage: true,
            codeQuality: true,
            documentation: true,
            performance: true
          },
          outputPath
        };

        const result = await orchestrator.validateMicroservice(validationRequest);

        if (!result.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'error',
                  message: result.error,
                  executionTime: result.executionTime
                }, null, 2),
              },
            ],
          };
        }

        // Guardar reporte si se especifica outputPath
        if (outputPath && result.validationReport) {
          await saveValidationReport(result.validationReport, outputPath);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                technology: result.validationReport?.project.technology,
                delegatedTo: result.delegatedTo?.name,
                report: result.validationReport,
                executionTime: result.executionTime
              }, null, 2),
            },
          ],
        };
      }

      case 'detect-technology': {
        const { projectPath } = args as { projectPath: string };

        console.error(`[Orchestrator] Detectando tecnología: ${projectPath}`);

        if (!(await directoryExists(projectPath))) {
          throw new McpError(ErrorCode.InvalidParams, `El directorio no existe: ${projectPath}`);
        }

        const technologyResult = await technologyDetector.detectTechnology(projectPath);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                detection: technologyResult,
                summary: {
                  technology: technologyResult.technology,
                  framework: technologyResult.framework,
                  confidence: `${technologyResult.confidence}%`,
                  topIndicators: technologyResult.indicators
                    .filter(i => i.found)
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 5)
                    .map(i => ({ name: i.name, type: i.type, weight: i.weight }))
                }
              }, null, 2),
            },
          ],
        };
      }

      case 'list-validators': {
        console.error(`[Orchestrator] Listando validadores disponibles`);

        const validators = await orchestrator.listAvailableValidators();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                validators: validators.map(v => ({
                  technology: v.technology,
                  name: v.name,
                  path: v.path,
                  available: v.available,
                  command: `${v.command} ${v.args.join(' ')}`
                })),
                summary: {
                  total: validators.length,
                  available: validators.filter(v => v.available).length,
                  unavailable: validators.filter(v => !v.available).length
                }
              }, null, 2),
            },
          ],
        };
      }

      case 'validate-batch': {
        const { inputPath, outputPath, standards } = args as {
          inputPath: string;
          outputPath: string;
          standards?: StandardsConfig;
        };

        console.error(`[Orchestrator] Validación en lote: ${inputPath}`);

        if (!(await directoryExists(inputPath))) {
          throw new McpError(ErrorCode.InvalidParams, `El directorio de entrada no existe: ${inputPath}`);
        }

        const batchResults = await processBatchValidation(inputPath, outputPath, standards);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                batchResults,
                summary: {
                  totalProjects: batchResults.length,
                  successful: batchResults.filter(r => r.success).length,
                  failed: batchResults.filter(r => !r.success).length,
                  outputPath
                }
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[Orchestrator] Error en herramienta ${name}:`, error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Error ejecutando ${name}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function saveValidationReport(report: any, outputPath: string): Promise<void> {
  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    const reportFileName = `validation-report-${report.project.name}-${Date.now()}.json`;
    const fullPath = path.join(outputPath, reportFileName);
    
    await fs.writeFile(fullPath, JSON.stringify(report, null, 2), 'utf-8');
    console.error(`[Orchestrator] Reporte guardado en: ${fullPath}`);
  } catch (error) {
    console.error(`[Orchestrator] Error guardando reporte:`, error);
  }
}

async function processBatchValidation(
  inputPath: string, 
  outputPath: string, 
  standards?: StandardsConfig
): Promise<any[]> {
  const results: any[] = [];
  
  try {
    const entries = await fs.readdir(inputPath, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory());
    
    for (const dir of directories) {
      const projectPath = path.join(inputPath, dir.name);
      
      try {
        console.error(`[Orchestrator] Procesando proyecto: ${dir.name}`);
        
        const validationRequest: ValidationRequest = {
          projectPath,
          standards: standards || {
            security: true,
            testing: true,
            coverage: true,
            codeQuality: true,
            documentation: true,
            performance: true
          },
          outputPath
        };
        
        const result = await orchestrator.validateMicroservice(validationRequest);
        
        results.push({
          projectName: dir.name,
          projectPath,
          success: result.success,
          technology: result.validationReport?.project.technology,
          overallScore: result.validationReport?.overallScore,
          overallStatus: result.validationReport?.overallStatus,
          error: result.error,
          executionTime: result.executionTime
        });
        
        // Guardar reporte individual
        if (result.validationReport) {
          await saveValidationReport(result.validationReport, outputPath);
        }
        
      } catch (error) {
        console.error(`[Orchestrator] Error procesando ${dir.name}:`, error);
        results.push({
          projectName: dir.name,
          projectPath,
          success: false,
          error: `Error procesando proyecto: ${error}`,
          executionTime: 0
        });
      }
    }
    
  } catch (error) {
    console.error(`[Orchestrator] Error en validación por lotes:`, error);
    throw error;
  }
  
  return results;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Orchestrator] Servidor MCP Standards Validation Orchestrator iniciado');
}

main().catch((error) => {
  console.error('[Orchestrator] Error fatal:', error);
  process.exit(1);
});