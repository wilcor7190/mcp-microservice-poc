import { FileUtils } from '../utils/file-utils.js';
import { MicroserviceSpecification, GenerationReport, RepositoryAnalysis } from '../types/index.js';
import Handlebars from 'handlebars';

export abstract class BaseGenerator {
  protected specification: MicroserviceSpecification;
  protected repositoryAnalyses: RepositoryAnalysis[];
  protected outputPath: string;
  protected generationReport: GenerationReport;

  constructor(
    specification: MicroserviceSpecification,
    repositoryAnalyses: RepositoryAnalysis[],
    outputPath: string
  ) {
    this.specification = specification;
    this.repositoryAnalyses = repositoryAnalyses;
    this.outputPath = outputPath;
    this.generationReport = this.initializeReport();
  }

  private initializeReport(): GenerationReport {
    return {
      timestamp: new Date().toISOString(),
      microservice_name: this.specification.microservice.name,
      specification_used: {
        name: this.specification.microservice.name,
        version: this.specification.microservice.version,
        port: this.specification.microservice.port,
        database: this.specification.architecture?.database || this.specification.database || 'postgresql',
        endpoints_count: this.specification.endpoints.length,
        integrations_count: this.specification.integrations?.length || 0
      },
      patterns_applied: [],
      generated_files: {
        total: 0,
        by_category: {
          source: 0,
          tests: 0,
          config: 0,
          docs: 0
        },
        endpoints_implemented: [],
        integrations_implemented: []
      },
      validation_results: {
        typescript_compilation: 'pending',
        tests_execution: 'pending',
        linting: 'pending',
        coverage: 'pending'
      },
      environment_setup: {
        required_secrets: [],
        config_files_generated: []
      },
      next_steps: []
    };
  }

  abstract generate(): Promise<void>;

  protected async createProjectStructure(): Promise<void> {
    const projectPath = this.getProjectPath();
    
    const directories = [
      'src/domain/entities',
      'src/domain/repositories',
      'src/domain/use-cases',
      'src/infrastructure/database',
      'src/infrastructure/web/controllers',
      'src/infrastructure/web/middleware',
      'src/infrastructure/external',
      'src/application/config',
      'src/application/middlewares',
      'src/application/validators',
      'src/shared/errors',
      'src/shared/utils',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'docs/api',
      'docs/architecture',
      'docker',
      '.github/workflows'
    ];

    console.log(`Creating project structure at: ${projectPath}`);
    
    for (const dir of directories) {
      await FileUtils.ensureDir(FileUtils.joinPaths(projectPath, dir));
    }
  }

  protected getProjectPath(): string {
    return FileUtils.joinPaths(this.outputPath, this.specification.microservice.name);
  }

  protected async renderTemplate(templateContent: string, context: any): Promise<string> {
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  protected async writeGeneratedFile(
    filePath: string, 
    content: string, 
    category: 'source' | 'tests' | 'config' | 'docs' = 'source'
  ): Promise<void> {
    await FileUtils.writeFile(filePath, content);
    this.generationReport.generated_files.total++;
    this.generationReport.generated_files.by_category[category]++;
    
    console.log(`Generated file: ${FileUtils.getRelativePath(this.getProjectPath(), filePath)}`);
  }

  protected addPatternApplied(sourceRepo: string, pattern: string, files: string[]): void {
    this.generationReport.patterns_applied.push({
      source_repo: sourceRepo,
      pattern,
      files_influenced: files
    });
  }

  protected addEndpointImplemented(
    path: string, 
    method: string, 
    controller: string, 
    useCase: string
  ): void {
    this.generationReport.generated_files.endpoints_implemented.push({
      path,
      method,
      controller,
      use_case: useCase
    });
  }

  protected addIntegrationImplemented(
    name: string, 
    type: string, 
    adapter: string
  ): void {
    this.generationReport.generated_files.integrations_implemented.push({
      name,
      type,
      adapter
    });
  }

  protected addRequiredSecret(secret: string): void {
    if (!this.generationReport.environment_setup.required_secrets.includes(secret)) {
      this.generationReport.environment_setup.required_secrets.push(secret);
    }
  }

  protected addConfigFileGenerated(configFile: string): void {
    if (!this.generationReport.environment_setup.config_files_generated.includes(configFile)) {
      this.generationReport.environment_setup.config_files_generated.push(configFile);
    }
  }

  protected addNextStep(step: string): void {
    if (!this.generationReport.next_steps.includes(step)) {
      this.generationReport.next_steps.push(step);
    }
  }

  protected updateValidationResult(type: keyof typeof this.generationReport.validation_results, result: string): void {
    this.generationReport.validation_results[type] = result;
  }

  protected async saveGenerationReport(): Promise<void> {
    const reportPath = FileUtils.joinPaths(this.outputPath, 'generation-report.json');
    await FileUtils.writeJsonFile(reportPath, this.generationReport);
    console.log(`Generation report saved to: ${reportPath}`);
  }

  protected getBestMatchingRepository(framework?: string): RepositoryAnalysis | null {
    if (this.repositoryAnalyses.length === 0) {
      return null;
    }

    if (framework) {
      const frameworkMatches = this.repositoryAnalyses.filter(repo => 
        repo.framework === framework
      );
      
      if (frameworkMatches.length > 0) {
        return frameworkMatches.reduce((best, current) => 
          current.patterns.length > best.patterns.length ? current : best
        );
      }
    }

    // Return the repository with the most patterns
    return this.repositoryAnalyses.reduce((best, current) => 
      current.patterns.length > best.patterns.length ? current : best
    );
  }

  protected createTemplateContext(): any {
    return {
      microservice: this.specification.microservice,
      database: this.specification.architecture?.database || this.specification.database || 'postgresql',
      endpoints: this.specification.endpoints,
      integrations: this.specification.integrations || [],
      security: this.specification.security || {},
      configuration: this.specification.configuration || {},
      technicalDetails: this.specification.technicalDetails || {},
      
      // Helper functions for templates
      helpers: {
        kebabCase: (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
        camelCase: (str: string) => str.charAt(0).toLowerCase() + str.slice(1),
        pascalCase: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
        snakeCase: (str: string) => str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
        upperCase: (str: string) => str.toUpperCase(),
        lowerCase: (str: string) => str.toLowerCase()
      }
    };
  }

  protected async copyTemplateFile(
    sourcePath: string, 
    destPath: string, 
    context?: any
  ): Promise<void> {
    if (await FileUtils.fileExists(sourcePath)) {
      const content = await FileUtils.readFile(sourcePath);
      
      if (context && (sourcePath.endsWith('.hbs') || sourcePath.endsWith('.template'))) {
        const renderedContent = await this.renderTemplate(content, context);
        await this.writeGeneratedFile(destPath, renderedContent);
      } else {
        await FileUtils.copyFile(sourcePath, destPath);
        this.generationReport.generated_files.total++;
        console.log(`Copied file: ${FileUtils.getRelativePath(this.getProjectPath(), destPath)}`);
      }
    }
  }

  protected generateEnvironmentVariables(): string[] {
    const envVars: string[] = [];

    // Database configuration
    const dbType = this.specification.architecture?.database || this.specification.database || 'postgresql';
    switch (dbType) {
      case 'oracle':
        envVars.push('DB_HOST=localhost');
        envVars.push('DB_PORT=1521');
        envVars.push('DB_USERNAME=your_username');
        envVars.push('DB_PASSWORD=your_password');
        envVars.push('DB_SERVICE_NAME=your_service_name');
        break;
      case 'postgresql':
        envVars.push('DB_HOST=localhost');
        envVars.push('DB_PORT=5432');
        envVars.push('DB_USERNAME=your_username');
        envVars.push('DB_PASSWORD=your_password');
        envVars.push('DB_NAME=your_database');
        break;
      case 'mysql':
        envVars.push('DB_HOST=localhost');
        envVars.push('DB_PORT=3306');
        envVars.push('DB_USERNAME=your_username');
        envVars.push('DB_PASSWORD=your_password');
        envVars.push('DB_NAME=your_database');
        break;
      case 'mongodb':
        envVars.push('MONGODB_URI=mongodb://localhost:27017/your_database');
        break;
    }

    // Security configuration
    if (this.specification.security?.authentication === 'JWT') {
      envVars.push('JWT_SECRET=your_jwt_secret_key');
      this.addRequiredSecret('JWT_SECRET');
    }

    // Application configuration
    envVars.push(`PORT=${this.specification.microservice.port}`);
    envVars.push('NODE_ENV=development');

    // CORS configuration
    if (this.specification.security?.cors) {
      envVars.push('CORS_ORIGIN=*');
    }

    // Custom secrets from specification
    if (this.specification.configuration?.secrets) {
      for (const secret of this.specification.configuration.secrets) {
        envVars.push(`${secret.toUpperCase()}=your_${secret.toLowerCase()}_value`);
        this.addRequiredSecret(secret);
      }
    }

    return envVars;
  }

  public getGenerationReport(): GenerationReport {
    return this.generationReport;
  }
}
