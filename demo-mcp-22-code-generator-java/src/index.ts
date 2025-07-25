#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { SpecAnalyzer } from './analyzers/spec-analyzer.js';
import { RepoAnalyzer } from './analyzers/repo-analyzer.js';
import { SpringBootGenerator } from './generators/springboot-generator.js';
import { FileUtils } from './utils/file-utils.js';
import { MicroserviceSpecification, RepositoryAnalysis, GenerationReport } from './types/index.js';

// Global state
let currentSpecification: MicroserviceSpecification | null = null;
let currentAnalyses: RepositoryAnalysis[] = [];
let currentGenerationReport: GenerationReport | null = null;

const server = new Server(
  {
    name: 'java-microservice-generator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze-input',
        description: 'Analiza carpeta input y extrae patrones de repositorios Java de referencia',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: 'Ruta a la carpeta input que contiene specifications/ y reference-repos/',
            },
          },
          required: ['inputPath'],
        },
      },
      {
        name: 'generate-microservice',
        description: 'Genera el microservicio Java/Spring Boot completo en carpeta output',
        inputSchema: {
          type: 'object',
          properties: {
            specificationPath: {
              type: 'string',
              description: 'Ruta al archivo JSON de especificación del microservicio',
            },
            outputPath: {
              type: 'string',
              description: 'Ruta donde se generará el microservicio Java',
            },
            packageName: {
              type: 'string',
              description: 'Nombre del paquete Java base (ej: com.company.service)',
              default: 'com.company.microservice',
            },
          },
          required: ['specificationPath', 'outputPath'],
        },
      },
      {
        name: 'get-patterns',
        description: 'Obtiene los patrones arquitectónicos identificados en el análisis',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'validate-output',
        description: 'Valida el código Java generado',
        inputSchema: {
          type: 'object',
          properties: {
            outputPath: {
              type: 'string',
              description: 'Ruta del microservicio generado a validar',
            },
          },
          required: ['outputPath'],
        },
      },
      {
        name: 'get-generation-status',
        description: 'Obtiene el estado del proceso de generación',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'analyze-input': {
        const { inputPath } = args as { inputPath: string };
        
        console.error(`[MCP] Iniciando análisis de: ${inputPath}`);
        
        const specAnalyzer = new SpecAnalyzer();
        const repoAnalyzer = new RepoAnalyzer();
        
        // Analizar especificaciones
        const specPath = `${inputPath}/specifications`;
        const specs = await specAnalyzer.analyzeSpecifications(specPath);
        
        if (specs.length > 0) {
          currentSpecification = specs[0]; // Usar la primera especificación
        }
        
        // Analizar repositorios de referencia
        const repoPath = `${inputPath}/reference-repos`;
        currentAnalyses = await repoAnalyzer.analyzeRepositories(repoPath);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                specificationsFound: specs.length,
                repositoriesAnalyzed: currentAnalyses.length,
                currentSpec: currentSpecification?.microservice.name,
                patterns: currentAnalyses.map(a => ({
                  name: a.name,
                  framework: a.framework,
                  architecture: a.architecture,
                  database: a.database
                }))
              }, null, 2),
            },
          ],
        };
      }

      case 'generate-microservice': {
        const { specificationPath, outputPath, packageName = 'com.company.microservice' } = args as {
          specificationPath: string;
          outputPath: string;
          packageName?: string;
        };
        
        console.error(`[MCP] Generando microservicio Java en: ${outputPath}`);
        
        const specAnalyzer = new SpecAnalyzer();
        const generator = new SpringBootGenerator();
        
        // Cargar especificación
        const spec = await specAnalyzer.loadSpecification(specificationPath);
        currentSpecification = spec;
        
        // Generar microservicio
        const report = await generator.generateMicroservice(spec, outputPath, packageName, currentAnalyses);
        currentGenerationReport = report;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: 'Microservicio Java/Spring Boot generado exitosamente',
                outputPath,
                report: {
                  filesGenerated: report.filesGenerated,
                  structureCreated: report.structureCreated,
                  dependencies: report.dependencies,
                  endpoints: report.endpoints
                }
              }, null, 2),
            },
          ],
        };
      }

      case 'get-patterns': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                patterns: currentAnalyses.map(analysis => ({
                  repository: analysis.name,
                  framework: analysis.framework,
                  architecture: analysis.architecture,
                  database: analysis.database,
                  layers: analysis.layers,
                  dependencies: analysis.dependencies.slice(0, 10), // Limitar para legibilidad
                  testingFramework: analysis.testingFramework
                }))
              }, null, 2),
            },
          ],
        };
      }

      case 'validate-output': {
        const { outputPath } = args as { outputPath: string };
        
        console.error(`[MCP] Validando código generado en: ${outputPath}`);
        
        const fileUtils = new FileUtils();
        const validation = await fileUtils.validateJavaProject(outputPath);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                validation: {
                  isValid: validation.isValid,
                  issues: validation.issues,
                  filesChecked: validation.filesChecked,
                  structure: validation.structure
                }
              }, null, 2),
            },
          ],
        };
      }

      case 'get-generation-status': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                currentSpecification: currentSpecification?.microservice.name || null,
                analysesCount: currentAnalyses.length,
                lastGeneration: currentGenerationReport ? {
                  filesGenerated: currentGenerationReport.filesGenerated,
                  timestamp: currentGenerationReport.timestamp
                } : null
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`[MCP] Error en herramienta ${name}:`, error);
    throw new McpError(
      ErrorCode.InternalError,
      `Error ejecutando ${name}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Servidor MCP Java Generator iniciado');
}

main().catch((error) => {
  console.error('[MCP] Error fatal:', error);
  process.exit(1);
});