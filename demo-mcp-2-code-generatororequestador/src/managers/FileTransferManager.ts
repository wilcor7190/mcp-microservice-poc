/**
 * File Transfer Manager - Handles file transfers between Orchestrator and specialized MCPs
 */

import * as fs from 'fs-extra';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import {
  FileTransferResult,
  TechnologyType,
  MCPConfig,
  MCPGeneratorConfig
} from '../types/index.js';

export class FileTransferManager {
  private readonly config: MCPConfig;

  constructor(config: MCPConfig) {
    this.config = config;
  }

  async transferToNodeJSMCP(specPath: string, reposPath: string): Promise<FileTransferResult> {
    console.log(chalk.blue('📁 Transferring files to Node.js MCP...'));
    
    const mcpConfig = this.config.nodejsGenerator;
    const nodejsReposPath = path.join(reposPath, 'nodejs-repos');
    
    return this.transferFiles(
      specPath,
      nodejsReposPath,
      mcpConfig,
      'nodejs'
    );
  }

  async transferSpecificationToNodeJSMCP(specPath: string): Promise<FileTransferResult> {
    console.log(chalk.blue('📁 Transferring specification to Node.js MCP...'));
    
    const mcpConfig = this.config.nodejsGenerator;
    
    return this.transferSpecificationOnly(
      specPath,
      mcpConfig,
      'nodejs'
    );
  }

  async transferToSpringBootMCP(specPath: string, reposPath: string): Promise<FileTransferResult> {
    console.log(chalk.blue('📁 Transferring files to Spring Boot MCP...'));
    
    const mcpConfig = this.config.springbootGenerator;
    const springbootReposPath = path.join(reposPath, 'springboot-repos');
    
    return this.transferFiles(
      specPath,
      springbootReposPath,
      mcpConfig,
      'springboot'
    );
  }

  async transferSpecificationToSpringBootMCP(specPath: string): Promise<FileTransferResult> {
    console.log(chalk.blue('📁 Transferring specification to Spring Boot MCP...'));
    
    const mcpConfig = this.config.springbootGenerator;
    
    return this.transferSpecificationOnly(
      specPath,
      mcpConfig,
      'springboot'
    );
  }

  async retrieveOutputFromMCP(mcpType: TechnologyType): Promise<string> {
    const mcpConfig = mcpType === 'nodejs' 
      ? this.config.nodejsGenerator 
      : this.config.springbootGenerator;

    const outputPath = mcpConfig.outputDirectory;
    
    if (!await fs.pathExists(outputPath)) {
      throw new Error(`MCP output directory not found: ${outputPath}`);
    }

    // Find the generated microservice directory
    const outputContents = await fsPromises.readdir(outputPath);
    const microserviceDirs = [];
    
    for (const item of outputContents) {
      const itemPath = path.join(outputPath, item);
      const stats = await fs.stat(itemPath);
      if (stats.isDirectory()) {
        microserviceDirs.push(itemPath);
      }
    }

    if (microserviceDirs.length === 0) {
      throw new Error('No generated microservice found in MCP output');
    }

    // Return the most recently modified directory
    let latestDir = microserviceDirs[0];
    let latestTime = (await fs.stat(latestDir)).mtime;

    for (const dir of microserviceDirs.slice(1)) {
      const dirTime = (await fs.stat(dir)).mtime;
      if (dirTime > latestTime) {
        latestDir = dir;
        latestTime = dirTime;
      }
    }

    return latestDir;
  }

  async copyMCPOutputToOrchestrator(mcpOutputPath: string, orchestratorOutputPath: string, microserviceName: string): Promise<FileTransferResult> {
    try {
      const targetPath = path.join(orchestratorOutputPath, microserviceName);
      
      // Ensure target directory exists
      await fs.ensureDir(targetPath);
      
      // Copy all contents from MCP output to orchestrator output
      await fs.copy(mcpOutputPath, targetPath, {
        overwrite: true,
        filter: (src) => {
          // Skip certain files/directories
          const basename = path.basename(src);
          return !basename.startsWith('.') && basename !== 'node_modules' && basename !== 'target';
        }
      });

      // Count files transferred
      const filesTransferred = await this.countFiles(targetPath);
      
      console.log(chalk.green(`✅ Successfully copied ${filesTransferred} files to ${targetPath}`));

      return {
        success: true,
        sourceFiles: [mcpOutputPath],
        targetPath,
        filesTransferred,
        errors: []
      };
    } catch (error) {
      console.error(chalk.red('❌ Error copying MCP output:'), error);
      
      return {
        success: false,
        sourceFiles: [mcpOutputPath],
        targetPath: orchestratorOutputPath,
        filesTransferred: 0,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  async cleanupMCPDirectories(mcpType: TechnologyType): Promise<void> {
    if (!this.config.fileOperations.cleanupAfterExecution) {
      return;
    }

    const mcpConfig = mcpType === 'nodejs' 
      ? this.config.nodejsGenerator 
      : this.config.springbootGenerator;

    try {
      // Clean input directory but preserve logs if configured
      const inputPath = mcpConfig.inputDirectory;
      
      if (await fs.pathExists(inputPath)) {
        const items = await fsPromises.readdir(inputPath);
        
        for (const item of items) {
          const itemPath = path.join(inputPath, item);
          
          // Preserve logs if configured
          if (this.config.fileOperations.preserveLogs && item.includes('log')) {
            continue;
          }
          
          await fs.remove(itemPath);
        }
        
        console.log(chalk.yellow(`🧹 Cleaned up ${mcpType} MCP input directory`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error cleaning up ${mcpType} MCP directories:`), error);
    }
  }

  async backupExistingFiles(targetPath: string): Promise<string | null> {
    if (!this.config.fileOperations.backupBeforeOverwrite) {
      return null;
    }

    if (!await fs.pathExists(targetPath)) {
      return null;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${targetPath}.backup.${timestamp}`;
      
      await fs.copy(targetPath, backupPath);
      console.log(chalk.yellow(`📦 Created backup at ${backupPath}`));
      
      return backupPath;
    } catch (error) {
      console.error(chalk.red('❌ Error creating backup:'), error);
      return null;
    }
  }

  async validateMCPDirectories(): Promise<{ nodejs: boolean; springboot: boolean }> {
    const nodejsValid = await this.validateMCPDirectory(this.config.nodejsGenerator);
    const springbootValid = await this.validateMCPDirectory(this.config.springbootGenerator);

    return {
      nodejs: nodejsValid,
      springboot: springbootValid
    };
  }

  private async validateMCPDirectory(mcpConfig: MCPGeneratorConfig): Promise<boolean> {
    try {
      // Check if MCP path exists
      if (!await fs.pathExists(mcpConfig.path)) {
        console.error(chalk.red(`❌ MCP path not found: ${mcpConfig.path}`));
        return false;
      }

      // Check if input directory exists, create if not
      if (!await fs.pathExists(mcpConfig.inputDirectory)) {
        await fs.ensureDir(mcpConfig.inputDirectory);
        console.log(chalk.yellow(`📁 Created input directory: ${mcpConfig.inputDirectory}`));
      }

      // Check if output directory exists, create if not
      if (!await fs.pathExists(mcpConfig.outputDirectory)) {
        await fs.ensureDir(mcpConfig.outputDirectory);
        console.log(chalk.yellow(`📁 Created output directory: ${mcpConfig.outputDirectory}`));
      }

      // Check if executable exists
      if (mcpConfig.executable && !await fs.pathExists(mcpConfig.executable)) {
        console.warn(chalk.yellow(`⚠️  MCP executable not found: ${mcpConfig.executable}`));
        // This is a warning, not a fatal error
      }

      return true;
    } catch (error) {
      console.error(chalk.red('❌ Error validating MCP directory:'), error);
      return false;
    }
  }

  private async transferFiles(
    specPath: string,
    reposPath: string,
    mcpConfig: MCPGeneratorConfig,
    technology: TechnologyType
  ): Promise<FileTransferResult> {
    const errors: string[] = [];
    const sourceFiles: string[] = [];
    let filesTransferred = 0;

    try {
      // Create input directories structure
      const specTargetDir = path.join(mcpConfig.inputDirectory, 'specification');
      const reposTargetDir = path.join(mcpConfig.inputDirectory, 'reference-repos');

      await fs.ensureDir(specTargetDir);
      await fs.ensureDir(reposTargetDir);

      // Transfer specification file
      if (await fs.pathExists(specPath)) {
        const specTargetPath = path.join(specTargetDir, 'microservice-spec.json');
        await fs.copy(specPath, specTargetPath, { overwrite: true });
        sourceFiles.push(specPath);
        filesTransferred++;
        console.log(chalk.green(`✅ Transferred specification to ${technology} MCP`));
      } else {
        const error = `Specification file not found: ${specPath}`;
        errors.push(error);
        console.error(chalk.red(`❌ ${error}`));
      }

      // Transfer repository files
      if (await fs.pathExists(reposPath)) {
        await fs.copy(reposPath, reposTargetDir, {
          overwrite: true,
          filter: (src) => {
            // Skip hidden files and node_modules
            const basename = path.basename(src);
            return !basename.startsWith('.') && 
                   basename !== 'node_modules' && 
                   basename !== 'target' &&
                   basename !== 'build';
          }
        });

        const repoFilesCount = await this.countFiles(reposTargetDir);
        filesTransferred += repoFilesCount;
        sourceFiles.push(reposPath);
        console.log(chalk.green(`✅ Transferred ${repoFilesCount} repository files to ${technology} MCP`));
      } else {
        const error = `Repository path not found: ${reposPath}`;
        errors.push(error);
        console.error(chalk.yellow(`⚠️  ${error}`));
      }

      return {
        success: errors.length === 0,
        sourceFiles,
        targetPath: mcpConfig.inputDirectory,
        filesTransferred,
        errors
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      console.error(chalk.red(`❌ Error transferring files to ${technology} MCP:`), error);

      return {
        success: false,
        sourceFiles,
        targetPath: mcpConfig.inputDirectory,
        filesTransferred,
        errors
      };
    }
  }

  private async transferSpecificationOnly(
    specPath: string,
    mcpConfig: MCPGeneratorConfig,
    technology: TechnologyType
  ): Promise<FileTransferResult> {
    const errors: string[] = [];
    const sourceFiles: string[] = [];
    let filesTransferred = 0;

    try {
      // Create input directories structure (solo specification)
      const specTargetDir = path.join(mcpConfig.inputDirectory, 'specification');
      await fs.ensureDir(specTargetDir);

      // Transfer specification file
      if (await fs.pathExists(specPath)) {
        const specTargetPath = path.join(specTargetDir, 'microservice-spec.json');
        await fs.copy(specPath, specTargetPath, { overwrite: true });
        sourceFiles.push(specPath);
        filesTransferred++;
        console.log(chalk.green(`✅ Transferred specification to ${technology} MCP`));
      } else {
        const error = `Specification file not found: ${specPath}`;
        errors.push(error);
        console.error(chalk.red(`❌ ${error}`));
      }

      console.log(chalk.green(`📋 Using ${technology} MCP's internal reference repositories`));

      return {
        success: errors.length === 0,
        sourceFiles,
        targetPath: mcpConfig.inputDirectory,
        filesTransferred,
        errors
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      console.error(chalk.red(`❌ Error transferring specification to ${technology} MCP:`), error);

      return {
        success: false,
        sourceFiles,
        targetPath: mcpConfig.inputDirectory,
        filesTransferred,
        errors
      };
    }
  }

  private async countFiles(directoryPath: string): Promise<number> {
    try {
      let count = 0;
      
      const countFilesRecursive = async (currentPath: string) => {
        const items = await fsPromises.readdir(currentPath);
        
        for (const item of items) {
          const itemPath = path.join(currentPath, item);
          const stats = await fs.stat(itemPath);
          
          if (stats.isDirectory()) {
            await countFilesRecursive(itemPath);
          } else {
            count++;
          }
        }
      };

      await countFilesRecursive(directoryPath);
      return count;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }

  async createDirectoryStructure(basePath: string, structure: string[]): Promise<void> {
    for (const dir of structure) {
      const dirPath = path.join(basePath, dir);
      await fs.ensureDir(dirPath);
    }
  }

  async ensureInputStructure(mcpType: TechnologyType): Promise<void> {
    const mcpConfig = mcpType === 'nodejs' 
      ? this.config.nodejsGenerator 
      : this.config.springbootGenerator;

    const requiredDirs = [
      'specification',
      'reference-repos'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(mcpConfig.inputDirectory, dir);
      await fs.ensureDir(dirPath);
    }
  }

  async getTransferStatus(mcpType: TechnologyType): Promise<{
    specificationExists: boolean;
    repositoriesCount: number;
    lastTransfer?: Date;
  }> {
    const mcpConfig = mcpType === 'nodejs' 
      ? this.config.nodejsGenerator 
      : this.config.springbootGenerator;

    const specPath = path.join(mcpConfig.inputDirectory, 'specification', 'microservice-spec.json');
    const reposPath = path.join(mcpConfig.inputDirectory, 'reference-repos');

    const specificationExists = await fs.pathExists(specPath);
    
    let repositoriesCount = 0;
    let lastTransfer: Date | undefined;

    if (await fs.pathExists(reposPath)) {
      const repos = await fsPromises.readdir(reposPath);
      repositoriesCount = repos.length;
      
      if (specificationExists) {
        const stats = await fs.stat(specPath);
        lastTransfer = stats.mtime;
      }
    }

    return {
      specificationExists,
      repositoriesCount,
      lastTransfer
    };
  }
}
