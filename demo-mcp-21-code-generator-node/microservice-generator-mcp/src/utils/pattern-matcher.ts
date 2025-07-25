import { FileUtils } from './file-utils.js';
import { AnalyzedPattern } from '../types/index.js';

export class PatternMatcher {
  private static readonly FRAMEWORK_PATTERNS = {
    nestjs: [
      'nest-cli.json',
      '@nestjs/core',
      '@nestjs/common',
      'nest start',
      'NestFactory'
    ],
    express: [
      'express',
      'app.listen',
      'app.use',
      'Router()'
    ],
    fastify: [
      'fastify',
      'fastify.listen',
      'fastify.register'
    ]
  };

  private static readonly ARCHITECTURE_PATTERNS = {
    'clean-architecture': [
      'src/domain',
      'src/infrastructure',
      'src/application',
      'use-cases',
      'entities',
      'repositories'
    ],
    'hexagonal': [
      'ports',
      'adapters',
      'src/domain',
      'src/infrastructure'
    ],
    'mvc': [
      'controllers',
      'models',
      'views',
      'routes'
    ]
  };

  private static readonly DATABASE_PATTERNS = {
    oracle: [
      'oracledb',
      'oracle',
      'cx_Oracle'
    ],
    postgresql: [
      'pg',
      'postgresql',
      'postgres'
    ],
    mysql: [
      'mysql',
      'mysql2'
    ],
    mongodb: [
      'mongodb',
      'mongoose'
    ]
  };

  static async analyzeRepository(repoPath: string): Promise<AnalyzedPattern[]> {
    const patterns: AnalyzedPattern[] = [];

    try {
      // Analizar framework
      const framework = await this.detectFramework(repoPath);
      if (framework) {
        patterns.push({
          source_repo: repoPath,
          pattern_type: 'framework',
          pattern_name: framework,
          description: `Framework ${framework} detected`,
          files: await this.getFrameworkFiles(repoPath, framework),
          framework
        });
      }

      // Analizar arquitectura
      const architecture = await this.detectArchitecture(repoPath);
      if (architecture) {
        patterns.push({
          source_repo: repoPath,
          pattern_type: 'architecture',
          pattern_name: architecture,
          description: `Architecture pattern ${architecture} detected`,
          files: await this.getArchitectureFiles(repoPath, architecture),
          architecture
        });
      }

      // Analizar base de datos
      const database = await this.detectDatabase(repoPath);
      if (database) {
        patterns.push({
          source_repo: repoPath,
          pattern_type: 'database',
          pattern_name: database,
          description: `Database ${database} integration detected`,
          files: await this.getDatabaseFiles(repoPath, database),
          database
        });
      }

      // Analizar patrones específicos
      const specificPatterns = await this.detectSpecificPatterns(repoPath);
      patterns.push(...specificPatterns);

    } catch (error) {
      console.error(`Error analyzing repository ${repoPath}:`, error);
    }

    return patterns;
  }

  private static async detectFramework(repoPath: string): Promise<string | null> {
    try {
      const packageJsonPath = await FileUtils.findPackageJson(repoPath);
      if (packageJsonPath) {
        const packageJson: any = await FileUtils.readJsonFile(packageJsonPath);
        const dependencies = { 
          ...packageJson.dependencies, 
          ...packageJson.devDependencies 
        };

        for (const [framework, patterns] of Object.entries(this.FRAMEWORK_PATTERNS)) {
          const hasPattern = patterns.some(pattern => 
            dependencies[pattern] || 
            JSON.stringify(packageJson).includes(pattern)
          );
          
          if (hasPattern) {
            return framework;
          }
        }
      }

      // Analizar archivos de configuración
      const configFiles = await FileUtils.findFiles('**/nest-cli.json', repoPath);
      if (configFiles.length > 0) return 'nestjs';

    } catch (error) {
      console.error('Error detecting framework:', error);
    }

    return null;
  }

  private static async detectArchitecture(repoPath: string): Promise<string | null> {
    try {
      const structure = await FileUtils.getDirectoryStructure(FileUtils.joinPaths(repoPath, 'src'));
      
      for (const [arch, patterns] of Object.entries(this.ARCHITECTURE_PATTERNS)) {
        const matchCount = patterns.filter(pattern => 
          structure.directories.some(dir => dir.includes(pattern)) ||
          structure.files.some(file => file.includes(pattern))
        ).length;

        if (matchCount >= Math.ceil(patterns.length * 0.6)) { // 60% match threshold
          return arch;
        }
      }
    } catch (error) {
      console.error('Error detecting architecture:', error);
    }

    return null;
  }

  private static async detectDatabase(repoPath: string): Promise<string | null> {
    try {
      const packageJsonPath = await FileUtils.findPackageJson(repoPath);
      if (packageJsonPath) {
        const packageJson: any = await FileUtils.readJsonFile(packageJsonPath);
        const dependencies = { 
          ...packageJson.dependencies, 
          ...packageJson.devDependencies 
        };

        for (const [db, patterns] of Object.entries(this.DATABASE_PATTERNS)) {
          const hasPattern = patterns.some(pattern => dependencies[pattern]);
          if (hasPattern) {
            return db;
          }
        }
      }
    } catch (error) {
      console.error('Error detecting database:', error);
    }

    return null;
  }

  private static async getFrameworkFiles(repoPath: string, framework: string): Promise<string[]> {
    const files: string[] = [];
    
    switch (framework) {
      case 'nestjs':
        files.push(...await FileUtils.findFiles('**/nest-cli.json', repoPath));
        files.push(...await FileUtils.findFiles('**/main.ts', repoPath));
        files.push(...await FileUtils.findFiles('**/app.module.ts', repoPath));
        break;
      case 'express':
        files.push(...await FileUtils.findFiles('**/app.js', repoPath));
        files.push(...await FileUtils.findFiles('**/server.js', repoPath));
        break;
      case 'fastify':
        files.push(...await FileUtils.findFiles('**/app.js', repoPath));
        files.push(...await FileUtils.findFiles('**/server.js', repoPath));
        break;
    }

    return files;
  }

  private static async getArchitectureFiles(repoPath: string, architecture: string): Promise<string[]> {
    const files: string[] = [];
    
    switch (architecture) {
      case 'clean-architecture':
        files.push(...await FileUtils.findFiles('**/src/domain/**/*.ts', repoPath));
        files.push(...await FileUtils.findFiles('**/src/infrastructure/**/*.ts', repoPath));
        files.push(...await FileUtils.findFiles('**/src/application/**/*.ts', repoPath));
        break;
      case 'hexagonal':
        files.push(...await FileUtils.findFiles('**/ports/**/*.ts', repoPath));
        files.push(...await FileUtils.findFiles('**/adapters/**/*.ts', repoPath));
        break;
      case 'mvc':
        files.push(...await FileUtils.findFiles('**/controllers/**/*.ts', repoPath));
        files.push(...await FileUtils.findFiles('**/models/**/*.ts', repoPath));
        files.push(...await FileUtils.findFiles('**/routes/**/*.ts', repoPath));
        break;
    }

    return files;
  }

  private static async getDatabaseFiles(repoPath: string, database: string): Promise<string[]> {
    const files: string[] = [];
    
    files.push(...await FileUtils.findFiles('**/database/**/*.ts', repoPath));
    files.push(...await FileUtils.findFiles('**/data-provider/**/*.ts', repoPath));
    files.push(...await FileUtils.findFiles('**/repository/**/*.ts', repoPath));
    files.push(...await FileUtils.findFiles('**/repositories/**/*.ts', repoPath));

    return files;
  }

  private static async detectSpecificPatterns(repoPath: string): Promise<AnalyzedPattern[]> {
    const patterns: AnalyzedPattern[] = [];

    // Detectar patrones de testing
    const testFiles = await FileUtils.findFiles('**/test/**/*.ts', repoPath);
    const specFiles = await FileUtils.findFiles('**/*.spec.ts', repoPath);
    
    if (testFiles.length > 0 || specFiles.length > 0) {
      patterns.push({
        source_repo: repoPath,
        pattern_type: 'testing',
        pattern_name: 'jest-testing',
        description: 'Jest testing pattern detected',
        files: [...testFiles, ...specFiles]
      });
    }

    // Detectar patrones de Docker
    const dockerFiles = await FileUtils.findFiles('**/Dockerfile', repoPath);
    const dockerComposeFiles = await FileUtils.findFiles('**/docker-compose*.yml', repoPath);
    
    if (dockerFiles.length > 0 || dockerComposeFiles.length > 0) {
      patterns.push({
        source_repo: repoPath,
        pattern_type: 'containerization',
        pattern_name: 'docker',
        description: 'Docker containerization pattern detected',
        files: [...dockerFiles, ...dockerComposeFiles]
      });
    }

    // Detectar patrones de deployment
    const deployFiles = await FileUtils.findFiles('**/deploy/**/*.yaml', repoPath);
    
    if (deployFiles.length > 0) {
      patterns.push({
        source_repo: repoPath,
        pattern_type: 'deployment',
        pattern_name: 'kubernetes',
        description: 'Kubernetes deployment pattern detected',
        files: deployFiles
      });
    }

    return patterns;
  }

  static async analyzeFileContent(filePath: string): Promise<string[]> {
    try {
      const content = await FileUtils.readFile(filePath);
      const patterns: string[] = [];

      // Detectar imports y dependencias
      const importMatches = content.match(/import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g);
      if (importMatches) {
        patterns.push(...importMatches.map(match => {
          const moduleMatch = match.match(/from\s+['"`]([^'"`]+)['"`]/);
          return moduleMatch ? moduleMatch[1] : '';
        }).filter(Boolean));
      }

      // Detectar decoradores de NestJS
      if (content.includes('@Controller') || content.includes('@Injectable') || content.includes('@Module')) {
        patterns.push('nestjs-decorators');
      }

      // Detectar patrones de base de datos
      if (content.includes('Repository') || content.includes('Entity') || content.includes('connection')) {
        patterns.push('database-patterns');
      }

      return patterns;
    } catch (error) {
      console.error(`Error analyzing file content ${filePath}:`, error);
      return [];
    }
  }
}
