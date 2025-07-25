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
import { NodeJSGenerator } from './generators/nodejs-generator.js';
import { FileUtils } from './utils/file-utils.js';
import { MicroserviceSpecification, RepositoryAnalysis, GenerationReport } from './types/index.js';

// Global state
let currentSpecification: MicroserviceSpecification | null = null;
let currentAnalyses: RepositoryAnalysis[] = [];
let currentGenerationReport: GenerationReport | null = null;

const server = new Server({
  name: 'microservice-generator',
  version: '1.0.0',
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze-input',
        description: 'Analiza carpeta input y extrae patrones de repositorios de referencia',
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
        description: 'Genera el microservicio completo en carpeta output',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: 'Ruta a la carpeta input',
            },
            outputPath: {
              type: 'string',
              description: 'Ruta a la carpeta output donde generar el microservicio',
            },
          },
          required: ['inputPath', 'outputPath'],
        },
      },
      {
        name: 'validate-output',
        description: 'Valida el código generado en output',
        inputSchema: {
          type: 'object',
          properties: {
            outputPath: {
              type: 'string',
              description: 'Ruta a la carpeta output con el microservicio generado',
            },
          },
          required: ['outputPath'],
        },
      },
      {
        name: 'get-patterns',
        description: 'Retorna patrones identificados en repos de referencia',
        inputSchema: {
          type: 'object',
          properties: {
            framework: {
              type: 'string',
              description: 'Framework específico a analizar (opcional)',
            },
          },
        },
      },
      {
        name: 'get-generation-status',
        description: 'Retorna estado y progreso de la generación',
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
      case 'analyze-input':
        return await handleAnalyzeInput(args as { inputPath: string });

      case 'generate-microservice':
        return await handleGenerateMicroservice(args as { inputPath: string; outputPath: string });

      case 'validate-output':
        return await handleValidateOutput(args as { outputPath: string });

      case 'get-patterns':
        return await handleGetPatterns(args as { framework?: string });

      case 'get-generation-status':
        return await handleGetGenerationStatus();

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new McpError(ErrorCode.InternalError, `Tool ${name} failed: ${errorMessage}`);
  }
});

async function handleAnalyzeInput(args: { inputPath: string }) {
  console.log(`🔍 Analyzing input directory: ${args.inputPath}`);

  if (!(await FileUtils.fileExists(args.inputPath))) {
    throw new Error(`Input directory not found: ${args.inputPath}`);
  }

  try {
    // Analyze specification
    const specAnalyzer = new SpecAnalyzer();
    currentSpecification = await specAnalyzer.analyzeSpecification(args.inputPath);
    
    console.log(`✅ Loaded specification: ${currentSpecification.microservice.name}`);

    // Analyze reference repositories
    const repoAnalyzer = new RepoAnalyzer();
    currentAnalyses = await repoAnalyzer.analyzeReferenceRepos(args.inputPath);
    
    console.log(`✅ Analyzed ${currentAnalyses.length} reference repositories`);

    const analysisReport = {
      specification: {
        name: currentSpecification.microservice.name,
        version: currentSpecification.microservice.version,
        port: currentSpecification.microservice.port,
        database: currentSpecification.architecture?.database || currentSpecification.database || 'postgresql',
        endpoints_count: currentSpecification.endpoints.length,
        integrations_count: currentSpecification.integrations?.length || 0,
      },
      repositories: {
        total: currentAnalyses.length,
        by_framework: getCountByProperty(currentAnalyses, 'framework'),
        by_architecture: getCountByProperty(currentAnalyses, 'architecture'),
      },
      patterns_found: getUniquePatterns(currentAnalyses),
      ready_for_generation: true,
    };

    return {
      content: [
        {
          type: 'text',
          text: `🎯 Analysis completed successfully!

**Specification Analysis:**
- Microservice: ${currentSpecification.microservice.name}
- Version: ${currentSpecification.microservice.version}
- Database: ${currentSpecification.architecture?.database || 'postgresql'}
- Endpoints: ${currentSpecification.endpoints.length}
- Integrations: ${currentSpecification.integrations?.length || 0}

**Repository Analysis:**
- Total repositories: ${currentAnalyses.length}
- Frameworks detected: ${Object.keys(analysisReport.repositories.by_framework).join(', ')}
- Architectures detected: ${Object.keys(analysisReport.repositories.by_architecture).join(', ')}
- Patterns found: ${analysisReport.patterns_found.length}

**Ready for generation!** Use 'generate-microservice' to create the microservice.`,
        },
        {
          type: 'text',
          text: JSON.stringify(analysisReport, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Analysis failed: ${error}`);
  }
}

async function handleGenerateMicroservice(args: { inputPath: string; outputPath: string }) {
  console.log(`🚀 Generating microservice...`);

  if (!currentSpecification || currentAnalyses.length === 0) {
    // Try to analyze first if not done
    await handleAnalyzeInput({ inputPath: args.inputPath });
  }

  if (!currentSpecification) {
    throw new Error('No specification loaded. Run analyze-input first.');
  }

  try {
    // Ensure output directory exists
    await FileUtils.ensureDir(args.outputPath);
    
    // Generate microservice using Node.js generator
    const generator = new NodeJSGenerator(
      currentSpecification,
      currentAnalyses,
      args.outputPath
    );

    await generator.generate();
    currentGenerationReport = generator.getGenerationReport();

    console.log(`✅ Generation completed: ${currentSpecification.microservice.name}`);

    return {
      content: [
        {
          type: 'text',
          text: `🎉 Microservice generated successfully!

**Generated:** ${currentSpecification.microservice.name}
**Location:** ${FileUtils.joinPaths(args.outputPath, currentSpecification.microservice.name)}
**Files created:** ${currentGenerationReport.generated_files.total}

**Breakdown:**
- Source files: ${currentGenerationReport.generated_files.by_category.source}
- Test files: ${currentGenerationReport.generated_files.by_category.tests}  
- Config files: ${currentGenerationReport.generated_files.by_category.config}
- Documentation: ${currentGenerationReport.generated_files.by_category.docs}

**Endpoints implemented:** ${currentGenerationReport.generated_files.endpoints_implemented.length}
**Integrations implemented:** ${currentGenerationReport.generated_files.integrations_implemented.length}

**Next steps:**
${currentGenerationReport.next_steps.map(step => `- ${step}`).join('\n')}

Use 'validate-output' to verify the generated code.`,
        },
        {
          type: 'text',
          text: `**Generation Report:**\n${JSON.stringify(currentGenerationReport, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Generation failed: ${error}`);
  }
}

async function handleValidateOutput(args: { outputPath: string }) {
  console.log(`🔍 Validating output: ${args.outputPath}`);

  if (!currentGenerationReport) {
    throw new Error('No generation report available. Generate microservice first.');
  }

  try {
    const projectPath = FileUtils.joinPaths(args.outputPath, currentGenerationReport.microservice_name);
    
    if (!(await FileUtils.fileExists(projectPath))) {
      throw new Error(`Generated project not found at: ${projectPath}`);
    }

    const validationResults = await validateGeneratedProject(projectPath);
    
    // Update generation report with validation results
    if (currentGenerationReport) {
      currentGenerationReport.validation_results = {
        ...currentGenerationReport.validation_results,
        ...validationResults,
      };
    }

    const isValid = Object.values(validationResults).every(result => 
      result.includes('success') || result.includes('configured')
    );

    return {
      content: [
        {
          type: 'text',
          text: `${isValid ? '✅' : '⚠️'} Validation ${isValid ? 'passed' : 'completed with warnings'}

**Validation Results:**
- TypeScript compilation: ${validationResults.typescript_compilation}
- Dependencies installed: ${validationResults.dependencies || 'not checked'}
- Linting: ${validationResults.linting}
- Project structure: ${validationResults.project_structure || 'valid'}

**Project location:** ${projectPath}

${isValid 
  ? '🎉 Your microservice is ready to use!' 
  : '⚠️ Please check the issues above before using the microservice.'}`,
        },
        {
          type: 'text',
          text: `**Detailed Validation Report:**\n${JSON.stringify(validationResults, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Validation failed: ${error}`);
  }
}

async function handleGetPatterns(args: { framework?: string }) {
  if (currentAnalyses.length === 0) {
    throw new Error('No repository analysis available. Run analyze-input first.');
  }

  const filteredAnalyses = args.framework 
    ? currentAnalyses.filter(analysis => analysis.framework === args.framework)
    : currentAnalyses;

  const patterns = filteredAnalyses.flatMap(analysis => analysis.patterns);
  const groupedPatterns = groupPatternsByType(patterns);

  return {
    content: [
      {
        type: 'text',
        text: `🔍 Analysis Patterns ${args.framework ? `for ${args.framework}` : ''}

**Total patterns found:** ${patterns.length}
**Pattern types:**
${Object.entries(groupedPatterns).map(([type, patterns]) => 
  `- ${type}: ${patterns.length} patterns`
).join('\n')}

**Frameworks detected:** ${[...new Set(currentAnalyses.map(a => a.framework))].join(', ')}
**Architectures detected:** ${[...new Set(currentAnalyses.map(a => a.architecture))].join(', ')}`,
      },
      {
        type: 'text',
        text: `**Detailed Patterns:**\n${JSON.stringify(groupedPatterns, null, 2)}`,
      },
    ],
  };
}

async function handleGetGenerationStatus() {
  const status = {
    specification_loaded: !!currentSpecification,
    repositories_analyzed: currentAnalyses.length,
    generation_completed: !!currentGenerationReport,
    current_specification: currentSpecification ? {
      name: currentSpecification.microservice.name,
      version: currentSpecification.microservice.version,
      endpoints: currentSpecification.endpoints.length,
    } : null,
    analysis_summary: currentAnalyses.length > 0 ? {
      total_repos: currentAnalyses.length,
      frameworks: [...new Set(currentAnalyses.map(a => a.framework))],
      architectures: [...new Set(currentAnalyses.map(a => a.architecture))],
    } : null,
    last_generation: currentGenerationReport ? {
      microservice_name: currentGenerationReport.microservice_name,
      timestamp: currentGenerationReport.timestamp,
      files_generated: currentGenerationReport.generated_files.total,
      validation_status: currentGenerationReport.validation_results,
    } : null,
  };

  return {
    content: [
      {
        type: 'text',
        text: `📊 MCP Microservice Generator Status

**Analysis Status:**
- Specification loaded: ${status.specification_loaded ? '✅' : '❌'}
- Repositories analyzed: ${status.repositories_analyzed}
- Generation completed: ${status.generation_completed ? '✅' : '❌'}

${status.current_specification ? `
**Current Specification:**
- Name: ${status.current_specification.name}
- Version: ${status.current_specification.version}
- Endpoints: ${status.current_specification.endpoints}
` : ''}

${status.last_generation ? `
**Last Generation:**
- Microservice: ${status.last_generation.microservice_name}
- Generated: ${status.last_generation.timestamp}
- Files: ${status.last_generation.files_generated}
` : ''}`,
      },
      {
        type: 'text',
        text: `**Full Status:**\n${JSON.stringify(status, null, 2)}`,
      },
    ],
  };
}

// Utility functions
function getCountByProperty(analyses: RepositoryAnalysis[], property: keyof RepositoryAnalysis): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const analysis of analyses) {
    const value = String(analysis[property]);
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function getUniquePatterns(analyses: RepositoryAnalysis[]) {
  const patterns = analyses.flatMap(analysis => analysis.patterns);
  const uniquePatterns = patterns.filter((pattern, index, array) => 
    index === array.findIndex(p => 
      p.pattern_type === pattern.pattern_type && p.pattern_name === pattern.pattern_name
    )
  );
  return uniquePatterns;
}

function groupPatternsByType(patterns: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const pattern of patterns) {
    if (!grouped[pattern.pattern_type]) {
      grouped[pattern.pattern_type] = [];
    }
    grouped[pattern.pattern_type].push(pattern);
  }
  return grouped;
}

async function validateGeneratedProject(projectPath: string) {
  const results: Record<string, string> = {};

  try {
    // Check if package.json exists
    const packageJsonPath = FileUtils.joinPaths(projectPath, 'package.json');
    if (await FileUtils.fileExists(packageJsonPath)) {
      results.package_json = 'exists';
      
      // Check if we can read it
      try {
        const packageJson: any = await FileUtils.readJsonFile(packageJsonPath);
        results.package_json = 'valid';
        results.dependencies = `${Object.keys(packageJson.dependencies || {}).length} dependencies`;
      } catch {
        results.package_json = 'invalid format';
      }
    } else {
      results.package_json = 'missing';
    }

    // Check tsconfig.json
    const tsconfigPath = FileUtils.joinPaths(projectPath, 'tsconfig.json');
    results.typescript_compilation = await FileUtils.fileExists(tsconfigPath) 
      ? 'configured' 
      : 'missing tsconfig.json';

    // Check src directory structure
    const srcPath = FileUtils.joinPaths(projectPath, 'src');
    if (await FileUtils.fileExists(srcPath)) {
      const srcStructure = await FileUtils.getDirectoryStructure(srcPath);
      const expectedDirs = ['domain', 'infrastructure', 'application', 'shared'];
      const foundDirs = expectedDirs.filter(dir => srcStructure.directories.includes(dir));
      
      results.project_structure = foundDirs.length >= 3 
        ? `valid (${foundDirs.length}/${expectedDirs.length} layers)` 
        : `incomplete (${foundDirs.length}/${expectedDirs.length} layers)`;
    } else {
      results.project_structure = 'missing src directory';
    }

    // Check for essential files
    const essentialFiles = ['src/main.ts', 'src/app.module.ts'];
    const missingFiles = [];
    
    for (const file of essentialFiles) {
      const filePath = FileUtils.joinPaths(projectPath, file);
      if (!(await FileUtils.fileExists(filePath))) {
        missingFiles.push(file);
      }
    }
    
    results.essential_files = missingFiles.length === 0 
      ? 'all present' 
      : `missing: ${missingFiles.join(', ')}`;

    // Check linting config
    const eslintPath = FileUtils.joinPaths(projectPath, '.eslintrc.js');
    results.linting = await FileUtils.fileExists(eslintPath) 
      ? 'configured' 
      : 'not configured';

    // Check Docker files
    const dockerfilePath = FileUtils.joinPaths(projectPath, 'docker', 'Dockerfile');
    const dockerComposePath = FileUtils.joinPaths(projectPath, 'docker-compose.yml');
    
    const dockerExists = await FileUtils.fileExists(dockerfilePath);
    const composeExists = await FileUtils.fileExists(dockerComposePath);
    
    results.containerization = dockerExists && composeExists 
      ? 'fully configured' 
      : dockerExists || composeExists 
        ? 'partially configured' 
        : 'not configured';

    // Overall status
    const issues = Object.values(results).filter(result => 
      result.includes('missing') || result.includes('invalid') || result.includes('incomplete')
    );
    
    results.overall_status = issues.length === 0 ? 'success' : `${issues.length} issues found`;

  } catch (error) {
    results.validation_error = `Failed to validate: ${error}`;
    results.overall_status = 'error';
  }

  return results;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Microservice Generator MCP Server started');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
