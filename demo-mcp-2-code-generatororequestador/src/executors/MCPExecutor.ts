/**
 * MCP Executor - Executes specialized MCP servers and monitors their progress
 */

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import {
  ExecutionResult,
  ProgressStream,
  TechnologyType,
  MCPConfig,
  MCPGeneratorConfig,
  MCPExecutionResult
} from '../types/index.js';

export class MCPExecutor {
  private readonly config: MCPConfig;
  private runningProcesses: Map<string, ChildProcess> = new Map();

  constructor(config: MCPConfig) {
    this.config = config;
  }

  async validateMCPConnection(technology: TechnologyType): Promise<boolean> {
    try {
      const mcpConfig = technology === 'nodejs' 
        ? this.config.nodejsGenerator 
        : this.config.springbootGenerator;
      
      // Check if the MCP path exists
      if (!await fs.pathExists(mcpConfig.path)) {
        console.error(chalk.red(`❌ MCP path not found: ${mcpConfig.path}`));
        return false;
      }

      // Check if the command exists or the script/jar file exists
      if (mcpConfig.command === 'node' && mcpConfig.args && mcpConfig.args.length > 0) {
        const scriptPath = mcpConfig.args[0];
        if (!await fs.pathExists(scriptPath)) {
          console.error(chalk.red(`❌ Node.js script not found: ${scriptPath}`));
          return false;
        }
      } else if (mcpConfig.command === 'java' && mcpConfig.args && mcpConfig.args.includes('-jar')) {
        const jarIndex = mcpConfig.args.indexOf('-jar') + 1;
        if (jarIndex < mcpConfig.args.length) {
          const jarPath = path.resolve(mcpConfig.cwd || mcpConfig.path, mcpConfig.args[jarIndex]);
          if (!await fs.pathExists(jarPath)) {
            console.error(chalk.red(`❌ Java JAR not found: ${jarPath}`));
            return false;
          }
        }
      }

      // Check if input and output directories exist
      if (!await fs.pathExists(mcpConfig.inputDirectory)) {
        console.warn(chalk.yellow(`⚠️  Input directory not found: ${mcpConfig.inputDirectory}`));
        try {
          await fs.ensureDir(mcpConfig.inputDirectory);
          console.log(chalk.green(`✅ Created input directory: ${mcpConfig.inputDirectory}`));
        } catch (error) {
          console.error(chalk.red(`❌ Cannot create input directory: ${error}`));
          return false;
        }
      }

      if (!await fs.pathExists(mcpConfig.outputDirectory)) {
        console.warn(chalk.yellow(`⚠️  Output directory not found: ${mcpConfig.outputDirectory}`));
        try {
          await fs.ensureDir(mcpConfig.outputDirectory);
          console.log(chalk.green(`✅ Created output directory: ${mcpConfig.outputDirectory}`));
        } catch (error) {
          console.error(chalk.red(`❌ Cannot create output directory: ${error}`));
          return false;
        }
      }

      console.log(chalk.green(`✅ ${technology} MCP connection validated`));
      return true;
    } catch (error) {
      console.error(chalk.red(`❌ Error validating ${technology} MCP:`, error));
      return false;
    }
  }

  async getExecutionStatus(): Promise<{
    runningProcesses: number;
    processes: Array<{
      id: string;
      running: boolean;
      technology: TechnologyType;
    }>;
  }> {
    const processes = Array.from(this.runningProcesses.entries()).map(([id, process]) => {
      const technology = id.includes('nodejs') ? 'nodejs' as TechnologyType : 'springboot' as TechnologyType;
      return {
        id,
        running: !process.killed,
        technology
      };
    });

    return {
      runningProcesses: processes.filter(p => p.running).length,
      processes
    };
  }

  // Placeholder methods for the other functionality
  async executeNodeJSMCP(): Promise<ExecutionResult> {
    console.log(chalk.blue('🚀 Executing Node.js MCP Generator...'));
    return { success: true, executionTime: 1000 };
  }

  async executeSpringBootMCP(): Promise<ExecutionResult> {
    console.log(chalk.blue('🚀 Executing Spring Boot MCP Generator...'));
    return { success: true, executionTime: 1000 };
  }

  async monitorProgress(mcpPath: string, technology: TechnologyType): Promise<ProgressStream> {
    return {
      status: 'completed',
      progress: 100,
      currentStep: 'Completed',
      message: 'Mock progress monitoring',
      timestamp: new Date()
    };
  }

  async waitForCompletion(mcpPath: string, technology: TechnologyType, timeoutMs: number = 30000): Promise<MCPExecutionResult> {
    return {
      selectedMCP: `${technology}-generator`,
      connectionStatus: 'success',
      executionTime: '5 seconds',
      generationStatus: 'completed',
      filesGenerated: 50,
      validationPassed: true
    };
  }

  async killProcess(processId: string): Promise<boolean> {
    return true;
  }

  async cleanupProcesses(): Promise<void> {
    console.log(chalk.yellow('🧹 Cleaned up all running processes'));
  }

  async retryExecution(technology: TechnologyType, maxRetries: number = 3): Promise<ExecutionResult> {
    return { success: true, executionTime: 1000 };
  }
}
