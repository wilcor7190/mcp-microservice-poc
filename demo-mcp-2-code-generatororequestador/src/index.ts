#!/usr/bin/env node

/**
 * MCP Microservice Orchestrator Server
 * Entry point for the Model Context Protocol server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import chalk from 'chalk';
import { MicroserviceOrchestrator } from './core/MicroserviceOrchestrator.js';

// Initialize the MCP server
const server = new McpServer({
  name: 'microservice-orchestrator',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Initialize the orchestrator
const orchestrator = new MicroserviceOrchestrator();

// Tool schemas
const AnalyzeAndSelectSchema = z.object({
  inputPath: z.string().describe('Path to the input directory containing specification and reference repositories')
});

const GenerateMicroserviceSchema = z.object({
  technology: z.enum(['nodejs', 'springboot']).describe('Technology to use for generation'),
  specificationPath: z.string().describe('Path to the microservice specification file'),
  referencePath: z.string().optional().describe('Path to the reference repositories directory (optional - MCPs have internal repos)'),
  outputPath: z.string().describe('Path where the generated microservice will be stored'),
  skipValidation: z.boolean().optional().default(false).describe('Skip validation steps'),
  generateDocs: z.boolean().optional().default(true).describe('Generate additional documentation')
});

const CompareTechnologiesSchema = z.object({
  specPath: z.string().describe('Path to the microservice specification file')
});

// Register tools
server.tool(
  'analyze-and-select',
  'Analyze microservice specification and reference repositories, then provide technology recommendations',
  {
    inputPath: z.string().describe('Path to the input directory containing specification and reference repositories')
  },
  async ({ inputPath }) => {
    try {
      console.error(chalk.cyan('🔍 Starting analysis and selection process...'));
      
      const result = await orchestrator.analyzeAndSelect(inputPath);
      
      const response = {
        success: true,
        analysis: {
          microserviceName: result.analysis.specification.name,
          complexity: result.analysis.specification.complexity || 'medium',
          databaseType: result.analysis.specification.database.type,
          endpointsCount: result.analysis.specification.endpoints.length,
          integrationsCount: result.analysis.specification.integrations.length
        },
        repositoriesFound: result.repositoriesFound,
        recommendation: result.recommendation,
        timestamp: new Date().toISOString()
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(chalk.red('❌ Error in analyze-and-select:'), error);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  }
);

server.tool(
  'generate-microservice',
  'Generate a microservice using the specified technology (nodejs or springboot)',
  {
    technology: z.enum(['nodejs', 'springboot']).describe('Technology to use for generation'),
    specificationPath: z.string().describe('Path to the microservice specification file'),
    referencePath: z.string().optional().describe('Path to the reference repositories directory (optional - MCPs have internal repos)'),
    outputPath: z.string().describe('Path where the generated microservice will be stored'),
    skipValidation: z.boolean().optional().default(false).describe('Skip validation steps'),
    generateDocs: z.boolean().optional().default(true).describe('Generate additional documentation')
  },
  async (options) => {
    try {
      console.error(chalk.cyan(`🚀 Starting ${options.technology} microservice generation...`));
      
      const result = await orchestrator.generateMicroservice(options as any);
      
      const response = {
        success: result.success,
        technology: result.technology,
        outputPath: result.outputPath,
        filesGenerated: result.filesGenerated,
        executionTime: `${Math.round(result.executionTime / 1000)} seconds`,
        errors: result.errors,
        warnings: result.warnings,
        reportPath: result.reportPath,
        timestamp: new Date().toISOString()
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(chalk.red('❌ Error in generate-microservice:'), error);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  }
);

server.tool(
  'compare-technologies',
  'Compare Node.js and Spring Boot technologies for the given microservice specification',
  {
    specPath: z.string().describe('Path to the microservice specification file')
  },
  async ({ specPath }) => {
    try {
      console.error(chalk.cyan('📊 Comparing technologies...'));
      
      const comparison = await orchestrator.compareTechnologies(specPath);
      
      const response = {
        success: true,
        comparison: {
          nodejs: {
            compatibility: comparison.nodejs.compatibilityScore,
            strengths: comparison.nodejs.strengths,
            weaknesses: comparison.nodejs.weaknesses,
            estimatedTime: comparison.nodejs.developmentTime,
            filesGenerated: comparison.nodejs.metrics.filesGenerated
          },
          springboot: {
            compatibility: comparison.springboot.compatibilityScore,
            strengths: comparison.springboot.strengths,
            weaknesses: comparison.springboot.weaknesses,
            estimatedTime: comparison.springboot.developmentTime,
            filesGenerated: comparison.springboot.metrics.filesGenerated
          },
          recommendation: {
            technology: comparison.recommendation.technology,
            confidence: comparison.recommendation.confidence,
            reasoning: comparison.recommendation.reasoning
          }
        },
        timestamp: new Date().toISOString()
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(chalk.red('❌ Error in compare-technologies:'), error);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  }
);

server.tool(
  'get-orchestration-status',
  'Get the current status of the orchestration system and MCP connections',
  {},
  async () => {
    try {
      console.error(chalk.cyan('📊 Getting orchestration status...'));
      
      const status = await orchestrator.getOrchestrationStatus();
      
      const response = {
        success: true,
        status: {
          mcpConnections: status.mcpConnections,
          runningProcesses: status.runningProcesses,
          lastExecution: status.lastExecution?.toISOString(),
          systemHealth: status.mcpConnections.nodejs && status.mcpConnections.springboot ? 'healthy' : 'degraded'
        },
        timestamp: new Date().toISOString()
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(chalk.red('❌ Error getting orchestration status:'), error);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    }
  }
);

// Main function to start the server
async function main() {
  try {
    console.error(chalk.blue('🚀 Starting MCP Microservice Orchestrator...'));
    console.error(chalk.blue('━'.repeat(60)));
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error(chalk.green('✅ MCP Microservice Orchestrator is running'));
    console.error(chalk.gray('   Ready to orchestrate microservice generation'));
    console.error(chalk.gray('   Available technologies: Node.js, Spring Boot'));
    console.error(chalk.blue('━'.repeat(60)));
  } catch (error) {
    console.error(chalk.red('❌ Fatal error starting MCP server:'), error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error(chalk.yellow('🛑 Received SIGINT, shutting down gracefully...'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error(chalk.yellow('🛑 Received SIGTERM, shutting down gracefully...'));
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error(chalk.red('❌ Fatal error in main():'), error);
  process.exit(1);
});
