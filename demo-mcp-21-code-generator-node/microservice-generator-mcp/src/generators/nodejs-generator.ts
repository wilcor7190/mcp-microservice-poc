import { BaseGenerator } from './base-generator.js';
import { FileUtils } from '../utils/file-utils.js';
import { SpecAnalyzer } from '../analyzers/spec-analyzer.js';
import { MicroserviceSpecification, RepositoryAnalysis } from '../types/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export class NodeJSGenerator extends BaseGenerator {
  private specAnalyzer: SpecAnalyzer;

  constructor(
    specification: MicroserviceSpecification,
    repositoryAnalyses: RepositoryAnalysis[],
    outputPath: string
  ) {
    super(specification, repositoryAnalyses, outputPath);
    this.specAnalyzer = new SpecAnalyzer();
    this.specAnalyzer['specification'] = specification; // Set the specification
  }

  // Helper method to get database type (supports both formats)
  private getDatabaseType(): string {
    return this.specification.architecture?.database || this.specification.database || 'postgresql';
  }

  async generate(): Promise<void> {
    console.log(`🚀 Starting generation of ${this.specification.microservice.name}`);

    try {
      // Step 1: Create project structure
      await this.createProjectStructure();

      // Step 2: Generate configuration files
      await this.generateConfigurationFiles();

      // Step 3: Generate application entry point
      await this.generateMainFiles();

      // Step 4: Generate endpoints
      await this.generateEndpoints();

      // Step 5: Generate database layer
      await this.generateDatabaseLayer();

      // Step 6: Generate integrations
      await this.generateIntegrations();

      // Step 7: Generate tests
      await this.generateTests();

      // Step 8: Generate documentation
      await this.generateDocumentation();

      // Step 9: Generate Docker files
      await this.generateDockerFiles();

      // Step 10: Generate CI/CD files
      await this.generateCICDFiles();

      // Step 11: Save generation report
      await this.saveGenerationReport();

      console.log(`✅ Successfully generated ${this.specification.microservice.name}`);
      
    } catch (error) {
      console.error('❌ Error during generation:', error);
      throw error;
    }
  }

  private async generateConfigurationFiles(): Promise<void> {
    console.log('📝 Generating configuration files...');

    // Generate package.json
    const packageJson = this.specAnalyzer.generatePackageJson();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'config'
    );

    // Generate tsconfig.json
    const tsConfig = this.generateTsConfig();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2),
      'config'
    );

    // Generate nest-cli.json
    const nestCli = this.generateNestCliConfig();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'nest-cli.json'),
      JSON.stringify(nestCli, null, 2),
      'config'
    );

    // Generate .env.example
    const envVars = this.generateEnvironmentVariables();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), '.env.example'),
      envVars.join('\n'),
      'config'
    );
    this.addConfigFileGenerated('.env.example');

    // Generate .gitignore
    await this.generateGitignore();

    // Generate ESLint and Prettier configs
    await this.generateLintingConfigs();
  }

  private async generateMainFiles(): Promise<void> {
    console.log('🏗️ Generating main application files...');

    const templateContext = this.createTemplateContext();

    // Generate main.ts
    const mainTemplate = await this.getTemplate('main.ts.hbs');
    const mainContent = await this.renderTemplate(mainTemplate, templateContext);
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'src', 'main.ts'),
      mainContent
    );

    // Generate app.module.ts
    const appModuleTemplate = await this.getTemplate('app.module.ts.hbs');
    const appModuleContent = await this.renderTemplate(appModuleTemplate, templateContext);
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'src', 'app.module.ts'),
      appModuleContent
    );

    this.addPatternApplied('nestjs-template', 'application-bootstrap', [
      'src/main.ts',
      'src/app.module.ts'
    ]);
  }

  private async generateEndpoints(): Promise<void> {
    console.log('🔗 Generating endpoints...');

    for (const endpoint of this.specification.endpoints) {
      await this.generateEndpoint(endpoint);
    }
  }

  private async generateEndpoint(endpoint: any): Promise<void> {
    const templateContext = {
      ...this.createTemplateContext(),
      ...endpoint
    };

    const endpointName = this.sanitizeEndpointName(endpoint.path);
    const baseDir = FileUtils.joinPaths(this.getProjectPath(), 'src');

    // Generate controller
    const controllerTemplate = await this.getTemplate('controller.ts.hbs');
    const controllerContent = await this.renderTemplate(controllerTemplate, templateContext);
    const controllerPath = FileUtils.joinPaths(
      baseDir, 
      'infrastructure', 
      'web', 
      'controllers', 
      `${endpointName}.controller.ts`
    );
    await this.writeGeneratedFile(controllerPath, controllerContent);

    // Generate use case
    const useCaseTemplate = await this.getTemplate('use-case.ts.hbs');
    const useCaseContent = await this.renderTemplate(useCaseTemplate, templateContext);
    const useCasePath = FileUtils.joinPaths(
      baseDir, 
      'domain', 
      'use-cases', 
      `${endpointName}.use-case.ts`
    );
    await this.writeGeneratedFile(useCasePath, useCaseContent);

    // Generate DTOs
    if (endpoint.inputParameters && endpoint.inputParameters.length > 0) {
      await this.generateDTOs(endpoint, endpointName, baseDir);
    }

    // Generate module
    await this.generateEndpointModule(endpoint, endpointName, baseDir);

    this.addEndpointImplemented(
      endpoint.path,
      endpoint.method,
      `src/infrastructure/web/controllers/${endpointName}.controller.ts`,
      `src/domain/use-cases/${endpointName}.use-case.ts`
    );
  }

  private async generateDTOs(endpoint: any, endpointName: string, baseDir: string): Promise<void> {
    // Generate request DTO
    const dtoContent = this.generateDTOContent(endpoint.inputParameters, `${endpointName}Request`);
    const dtoPath = FileUtils.joinPaths(
      baseDir, 
      'infrastructure', 
      'web', 
      'dto', 
      `${endpointName}-request.dto.ts`
    );
    await this.writeGeneratedFile(dtoPath, dtoContent);
  }

  private generateDTOContent(parameters: any[], className: string): string {
    const imports = ['IsNotEmpty', 'IsOptional', 'IsString', 'IsNumber', 'IsBoolean'];
    const usedImports = new Set<string>();

    const fields = parameters.map(param => {
      const decorators: string[] = [];
      
      if (param.required) {
        decorators.push('@IsNotEmpty()');
        usedImports.add('IsNotEmpty');
      } else {
        decorators.push('@IsOptional()');
        usedImports.add('IsOptional');
      }

      switch (param.type) {
        case 'String':
          decorators.push('@IsString()');
          usedImports.add('IsString');
          break;
        case 'Number':
          decorators.push('@IsNumber()');
          usedImports.add('IsNumber');
          break;
        case 'Boolean':
          decorators.push('@IsBoolean()');
          usedImports.add('IsBoolean');
          break;
      }

      return `  ${decorators.join('\n  ')}\n  ${param.name}: ${param.type.toLowerCase()};`;
    }).join('\n\n');

    const importStatement = `import { ${Array.from(usedImports).join(', ')} } from 'class-validator';`;

    return `${importStatement}
import { ApiProperty } from '@nestjs/swagger';

export class ${className}Dto {
${fields}
}`;
  }

  private async generateEndpointModule(endpoint: any, endpointName: string, baseDir: string): Promise<void> {
    const moduleName = `${this.toPascalCase(endpointName)}Module`;
    const controllerName = `${this.toPascalCase(endpointName)}Controller`;
    const useCaseName = `${this.toPascalCase(endpointName)}UseCase`;

    const moduleContent = `import { Module } from '@nestjs/common';
import { ${controllerName} } from '../controllers/${endpointName}.controller';
import { ${useCaseName} } from '../../../domain/use-cases/${endpointName}.use-case';

@Module({
  controllers: [${controllerName}],
  providers: [${useCaseName}],
  exports: [${useCaseName}],
})
export class ${moduleName} {}`;

    const modulePath = FileUtils.joinPaths(
      baseDir, 
      'infrastructure', 
      'web', 
      'modules', 
      `${endpointName}.module.ts`
    );
    await this.writeGeneratedFile(modulePath, moduleContent);
  }

  private async generateDatabaseLayer(): Promise<void> {
    console.log('🗄️ Generating database layer...');

    const dbConfig = this.specAnalyzer.getDatabaseConnectionConfig();
    const templateContext = {
      ...this.createTemplateContext(),
      databaseConfig: dbConfig
    };

    // Generate database module
    const dbModuleContent = this.generateDatabaseModule();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'src', 'infrastructure', 'database', 'database.module.ts'),
      dbModuleContent
    );

    // Generate database connection configuration
    await this.generateDatabaseConfig(templateContext);

    this.addPatternApplied('database-integration', this.getDatabaseType(), [
      'src/infrastructure/database/database.module.ts',
      'src/infrastructure/database/database.config.ts'
    ]);
  }

  private generateDatabaseModule(): string {
    switch (this.getDatabaseType()) {
      case 'oracle':
      case 'postgresql':
      case 'mysql':
        return this.generateTypeOrmModule();
      case 'mongodb':
        return this.generateMongooseModule();
      default:
        return this.generateGenericDatabaseModule();
    }
  }

  private generateTypeOrmModule(): string {
    return `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: '${this.getDatabaseType()}' as any,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        ${this.getDatabaseType() === 'oracle' 
          ? "serviceName: configService.get('DB_SERVICE_NAME')," 
          : "database: configService.get('DB_NAME'),"}
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}`;
  }

  private generateMongooseModule(): string {
    return `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}`;
  }

  private generateGenericDatabaseModule(): string {
    return `import { Module } from '@nestjs/common';

@Module({
  providers: [],
  exports: [],
})
export class DatabaseModule {}`;
  }

  private async generateDatabaseConfig(context: any): Promise<void> {
    const configContent = `import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: '${this.getDatabaseType()}',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || ${this.getDefaultPort()},
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ${this.getDatabaseType() === 'oracle' 
    ? "serviceName: process.env.DB_SERVICE_NAME," 
    : "database: process.env.DB_NAME,"}
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'src', 'infrastructure', 'database', 'database.config.ts'),
      configContent
    );
  }

  private getDefaultPort(): number {
    switch (this.getDatabaseType()) {
      case 'oracle': return 1521;
      case 'postgresql': return 5432;
      case 'mysql': return 3306;
      case 'mongodb': return 27017;
      default: return 5432;
    }
  }

  private async generateIntegrations(): Promise<void> {
    console.log('🔌 Generating integrations...');

    if (this.specification.integrations) {
      for (const integration of this.specification.integrations) {
        if (integration.legacyServices) {
          for (const service of integration.legacyServices) {
            await this.generateLegacyServiceAdapter(service);
          }
        }
      }
    }
  }

  private async generateLegacyServiceAdapter(service: any): Promise<void> {
    const adapterName = `${this.toPascalCase(service.name)}Adapter`;
    const fileName = `${this.toKebabCase(service.name)}.adapter.ts`;

    const adapterContent = `import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface ${this.toPascalCase(service.name)}Request {
  ${service.inputMapping?.map((mapping: any) => 
    `${mapping.legacyField}: ${this.getTypeScriptType(mapping.type)};`
  ).join('\n  ') || '// Add request fields here'}
}

export interface ${this.toPascalCase(service.name)}Response {
  ${service.outputMapping?.map((mapping: any) => 
    `${mapping.legacyField}: ${this.getTypeScriptType(mapping.type)};`
  ).join('\n  ') || '// Add response fields here'}
}

@Injectable()
export class ${adapterName} {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('NODE_ENV') === 'production' 
      ? '${service.urls.PROD}' 
      : '${service.urls.QA}';
  }

  async call${this.toPascalCase(service.name)}(
    request: ${this.toPascalCase(service.name)}Request
  ): Promise<${this.toPascalCase(service.name)}Response> {
    try {
      console.log(\`Calling ${service.name} with request:\`, request);

      const response = await firstValueFrom(
        this.httpService.post<${this.toPascalCase(service.name)}Response>(
          \`\${this.baseUrl}/${service.name}\`,
          request,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            timeout: 30000,
          }
        )
      );

      console.log(\`${service.name} response:\`, response.data);
      return response.data;

    } catch (error: any) {
      console.error(\`Error calling ${service.name}:\`, error);
      
      if (error.response) {
        throw new HttpException(
          \`${service.name} service error: \${error.response.data?.message || error.message}\`,
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        throw new HttpException(
          \`${service.name} service unavailable: \${error.message}\`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
    }
  }
}`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'src', 'infrastructure', 'external', fileName),
      adapterContent
    );

    this.addIntegrationImplemented(
      service.name,
      service.type,
      `src/infrastructure/external/${fileName}`
    );
  }

  private async generateTests(): Promise<void> {
    console.log('🧪 Generating tests...');

    // Generate unit tests for use cases
    for (const endpoint of this.specification.endpoints) {
      await this.generateUseCaseTest(endpoint);
    }

    // Generate integration tests
    await this.generateIntegrationTests();

    // Generate e2e tests
    await this.generateE2ETests();

    // Generate test configuration
    await this.generateTestConfig();
  }

  private async generateUseCaseTest(endpoint: any): Promise<void> {
    const endpointName = this.sanitizeEndpointName(endpoint.path);
    const testContent = this.generateUseCaseTestContent(endpoint, endpointName);
    
    await this.writeGeneratedFile(
      FileUtils.joinPaths(
        this.getProjectPath(), 
        'tests', 
        'unit', 
        `${endpointName}.use-case.spec.ts`
      ),
      testContent,
      'tests'
    );
  }

  private generateUseCaseTestContent(endpoint: any, endpointName: string): string {
    const useCaseName = `${this.toPascalCase(endpointName)}UseCase`;
    
    return `import { Test, TestingModule } from '@nestjs/testing';
import { ${useCaseName} } from '../../src/domain/use-cases/${endpointName}.use-case';

describe('${useCaseName}', () => {
  let useCase: ${useCaseName};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${useCaseName}],
    }).compile();

    useCase = module.get<${useCaseName}>(${useCaseName});
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should execute successfully with valid input', async () => {
    // Arrange
    const mockRequest = {
      ${endpoint.inputParameters?.map((param: any) => 
        `${param.name}: ${this.getMockValue(param.type)}`
      ).join(',\n      ') || '// Add test data here'}
    };

    // Act
    const result = await useCase.execute(${endpoint.parameters?.length ? 
      endpoint.parameters.map(() => "'test-param'").join(', ') + (endpoint.inputParameters?.length ? ', ' : '') : ''}${endpoint.inputParameters?.length ? 'mockRequest' : ''});

    // Assert
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should handle validation errors', async () => {
    // Arrange
    const invalidRequest = {};

    // Act & Assert
    ${endpoint.inputParameters?.some((p: any) => p.required) ? `
    await expect(useCase.execute(${endpoint.parameters?.length ? 
      endpoint.parameters.map(() => "'test-param'").join(', ') + ', ' : ''}invalidRequest as any))
      .rejects.toThrow();
    ` : '// Add validation tests here'}
  });
});`;
  }

  private async generateIntegrationTests(): Promise<void> {
    const testContent = `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Integration Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should initialize application', () => {
    expect(app).toBeDefined();
  });

  // Add integration tests for database connections, external services, etc.
});`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'tests', 'integration', 'app.integration.spec.ts'),
      testContent,
      'tests'
    );
  }

  private async generateE2ETests(): Promise<void> {
    const testContent = `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  ${this.specification.endpoints.map(endpoint => `
  it('${endpoint.method} ${endpoint.path}', () => {
    return request(app.getHttpServer())
      .${endpoint.method.toLowerCase()}('${endpoint.path}')
      ${endpoint.method !== 'GET' ? `.send({
        ${endpoint.inputParameters?.map((param: any) => 
          `${param.name}: ${this.getMockValue(param.type)}`
        ).join(',\n        ') || '// Add test data'}
      })` : ''}
      .expect(${endpoint.responses?.[0]?.status || 200});
  });`).join('\n')}
});`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'tests', 'e2e', 'app.e2e-spec.ts'),
      testContent,
      'tests'
    );
  }

  private async generateTestConfig(): Promise<void> {
    const jestConfig = {
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testEnvironment: 'node',
      testRegex: '.e2e-spec.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
    };

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'tests', 'jest-e2e.json'),
      JSON.stringify(jestConfig, null, 2),
      'config'
    );
  }

  private async generateDocumentation(): Promise<void> {
    console.log('📚 Generating documentation...');

    // Generate README.md
    await this.generateReadme();

    // Generate API documentation
    await this.generateApiDocs();

    // Generate architecture documentation
    await this.generateArchitectureDocs();
  }

  private async generateReadme(): Promise<void> {
    const readmeContent = `# ${this.specification.microservice.name}

${this.specification.microservice.description}

## Description

${this.specification.microservice.summary}

## Installation

\`\`\`bash
$ npm install
\`\`\`

## Configuration

Copy the environment file and configure your variables:

\`\`\`bash
$ cp .env.example .env
\`\`\`

Required environment variables:
${this.generateEnvironmentVariables().map(env => `- \`${env.split('=')[0]}\``).join('\n')}

## Running the app

\`\`\`bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
\`\`\`

## Test

\`\`\`bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
\`\`\`

## API Endpoints

${this.specification.endpoints.map(endpoint => `
### ${endpoint.method} ${endpoint.path}

${endpoint.description}

**Parameters:**
${endpoint.inputParameters?.map((param: any) => 
  `- \`${param.name}\` (${param.type}${param.required ? ', required' : ', optional'}): ${param.description}`
).join('\n') || 'None'}

**Responses:**
${endpoint.responses?.map((resp: any) => `- ${resp.status}: ${resp.description}`).join('\n') || 'Standard HTTP responses'}
`).join('\n')}

## Database

This microservice uses ${this.getDatabaseType().toUpperCase()} as the database.

## Integrations

${this.specification.integrations?.map(integration => `
### ${integration.name}

${integration.description}

**Type:** ${integration.type}
**Connection:** ${integration.connection}
`).join('\n') || 'No external integrations'}

## Team

**Team:** ${this.specification.microservice.team}
**Version:** ${this.specification.microservice.version}
**Repository:** ${this.specification.microservice.repository}

## License

Private - ${this.specification.microservice.team}
`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'README.md'),
      readmeContent,
      'docs'
    );
  }

  private async generateApiDocs(): Promise<void> {
    const swaggerConfig = `import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('${this.specification.microservice.name}')
    .setDescription('${this.specification.microservice.description}')
    .setVersion('${this.specification.microservice.version}')
    .addTag('api')
    ${this.specification.security?.authentication === 'JWT' ? ".addBearerAuth()" : ""}
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'src', 'shared', 'swagger.config.ts'),
      swaggerConfig,
      'docs'
    );
  }

  private async generateArchitectureDocs(): Promise<void> {
    const archContent = `# Architecture Documentation

## Overview

This microservice follows Clean Architecture principles with the following layers:

## Project Structure

\`\`\`
src/
├── domain/           # Business logic layer
│   ├── entities/     # Domain entities
│   ├── repositories/ # Repository interfaces
│   └── use-cases/    # Business use cases
├── infrastructure/   # External concerns
│   ├── database/     # Database implementations
│   ├── web/          # HTTP controllers
│   └── external/     # External service adapters
├── application/      # Application layer
│   ├── config/       # Configuration
│   ├── middlewares/  # Application middlewares
│   └── validators/   # Input validation
└── shared/           # Shared utilities
    ├── errors/       # Error handling
    └── utils/        # Common utilities
\`\`\`

## Principles

1. **Dependency Inversion**: Dependencies point inward toward the domain
2. **Single Responsibility**: Each class has one reason to change
3. **Interface Segregation**: Clients depend only on interfaces they use
4. **Domain-Driven Design**: Business logic is isolated in the domain layer

## Database

- **Type**: ${this.getDatabaseType().toUpperCase()}
- **ORM**: ${this.getDatabaseType() === 'mongodb' ? 'Mongoose' : 'TypeORM'}

## Testing Strategy

- **Unit Tests**: Domain logic and use cases
- **Integration Tests**: Database and external service integrations
- **E2E Tests**: Full request/response cycles

## Security

${this.specification.security ? `
- **Authentication**: ${this.specification.security.authentication}
- **Authorization**: ${this.specification.security.authorization}
- **CORS**: ${this.specification.security.cors ? 'Enabled' : 'Disabled'}
` : 'No security configuration specified'}
`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'docs', 'architecture', 'README.md'),
      archContent,
      'docs'
    );
  }

  private async generateDockerFiles(): Promise<void> {
    console.log('🐳 Generating Docker files...');

    // Generate Dockerfile
    const dockerfile = this.generateDockerfile();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'docker', 'Dockerfile'),
      dockerfile,
      'config'
    );

    // Generate docker-compose.yml
    const dockerCompose = this.generateDockerCompose();
    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), 'docker-compose.yml'),
      dockerCompose,
      'config'
    );

    this.addConfigFileGenerated('docker-compose.yml');
    this.addNextStep('Run \'docker-compose up\' to start with database');
  }

  private generateDockerfile(): string {
    return `# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE ${this.specification.microservice.port}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${this.specification.microservice.port}/health || exit 1

# Start application
CMD ["node", "dist/main"]`;
  }

  private generateDockerCompose(): string {
    const dbService = this.generateDatabaseService();
    
    return `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "${this.specification.microservice.port}:${this.specification.microservice.port}"
    environment:
      - NODE_ENV=development
      - PORT=${this.specification.microservice.port}
      ${this.getDatabaseEnvVars()}
    depends_on:
      - database
    networks:
      - app-network

  database:
    ${dbService}
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  ${this.getDatabaseType()}_data:`;
  }

  private generateDatabaseService(): string {
    switch (this.getDatabaseType()) {
      case 'postgresql':
        return `image: postgres:15-alpine
    environment:
      - POSTGRES_DB=\${DB_NAME:-microservice_db}
      - POSTGRES_USER=\${DB_USERNAME:-postgres}
      - POSTGRES_PASSWORD=\${DB_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgresql_data:/var/lib/postgresql/data`;
      
      case 'mysql':
        return `image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=\${DB_PASSWORD:-mysql}
      - MYSQL_DATABASE=\${DB_NAME:-microservice_db}
      - MYSQL_USER=\${DB_USERNAME:-mysql}
      - MYSQL_PASSWORD=\${DB_PASSWORD:-mysql}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql`;
      
      case 'mongodb':
        return `image: mongo:6-jammy
    environment:
      - MONGO_INITDB_ROOT_USERNAME=\${DB_USERNAME:-mongo}
      - MONGO_INITDB_ROOT_PASSWORD=\${DB_PASSWORD:-mongo}
      - MONGO_INITDB_DATABASE=\${DB_NAME:-microservice_db}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db`;
      
      default:
        return `image: postgres:15-alpine
    environment:
      - POSTGRES_DB=microservice_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    volumes:
      - postgresql_data:/var/lib/postgresql/data`;
    }
  }

  private getDatabaseEnvVars(): string {
    switch (this.getDatabaseType()) {
      case 'oracle':
        return `- DB_HOST=database
      - DB_PORT=1521
      - DB_USERNAME=\${DB_USERNAME:-oracle}
      - DB_PASSWORD=\${DB_PASSWORD:-oracle}
      - DB_SERVICE_NAME=\${DB_SERVICE_NAME:-XEPDB1}`;
      
      case 'postgresql':
        return `- DB_HOST=database
      - DB_PORT=5432
      - DB_USERNAME=\${DB_USERNAME:-postgres}
      - DB_PASSWORD=\${DB_PASSWORD:-postgres}
      - DB_NAME=\${DB_NAME:-microservice_db}`;
      
      case 'mysql':
        return `- DB_HOST=database
      - DB_PORT=3306
      - DB_USERNAME=\${DB_USERNAME:-mysql}
      - DB_PASSWORD=\${DB_PASSWORD:-mysql}
      - DB_NAME=\${DB_NAME:-microservice_db}`;
      
      case 'mongodb':
        return `- MONGODB_URI=mongodb://\${DB_USERNAME:-mongo}:\${DB_PASSWORD:-mongo}@database:27017/\${DB_NAME:-microservice_db}?authSource=admin`;
      
      default:
        return `- DB_HOST=database
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=postgres
      - DB_NAME=microservice_db`;
    }
  }

  private async generateCICDFiles(): Promise<void> {
    console.log('🔄 Generating CI/CD files...');

    const workflow = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test:cov
    
    - name: Run e2e tests
      run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -f docker/Dockerfile -t ${this.specification.microservice.name}:latest .
    
    - name: Run security scan
      run: |
        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
          -v \$PWD:/tmp/.cache/ aquasec/trivy:latest image \\
          --exit-code 0 --severity HIGH,CRITICAL \\
          ${this.specification.microservice.name}:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to staging
      run: echo "Deploy to staging environment"
      # Add your deployment steps here`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), '.github', 'workflows', 'ci-cd.yml'),
      workflow,
      'config'
    );

    this.addConfigFileGenerated('.github/workflows/ci-cd.yml');
  }

  private async generateGitignore(): Promise<void> {
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directory
# https://docs.npmjs.com/misc/faq#should-i-check-my-node-modules-folder-into-git
node_modules

# Debug log from npm
npm-debug.log

# IDE
.idea
*.swp
*.swo

# OS X
.DS_Store

# Windows
Thumbs.db

# Application
dist/
build/
tmp/`;

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), '.gitignore'),
      gitignoreContent,
      'config'
    );
  }

  private async generateLintingConfigs(): Promise<void> {
    // ESLint config
    const eslintConfig = {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      extends: [
        '@nestjs',
      ],
      root: true,
      env: {
        node: true,
        jest: true,
      },
      ignorePatterns: ['.eslintrc.js'],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    };

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), '.eslintrc.js'),
      `module.exports = ${JSON.stringify(eslintConfig, null, 2)};`,
      'config'
    );

    // Prettier config
    const prettierConfig = {
      singleQuote: true,
      trailingComma: 'all',
    };

    await this.writeGeneratedFile(
      FileUtils.joinPaths(this.getProjectPath(), '.prettierrc'),
      JSON.stringify(prettierConfig, null, 2),
      'config'
    );
  }

  private generateTsConfig(): any {
    return {
      compilerOptions: {
        module: 'commonjs',
        declaration: true,
        removeComments: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        target: 'ES2021',
        sourceMap: true,
        outDir: './dist',
        baseUrl: './',
        incremental: true,
        skipLibCheck: true,
        strictNullChecks: false,
        noImplicitAny: false,
        strictBindCallApply: false,
        forceConsistentCasingInFileNames: false,
        noFallthroughCasesInSwitch: false,
      },
    };
  }

  private generateNestCliConfig(): any {
    return {
      $schema: 'https://json.schemastore.org/nest-cli',
      collection: '@nestjs/schematics',
      sourceRoot: 'src',
      compilerOptions: {
        deleteOutDir: true,
      },
    };
  }

  private async getTemplate(templateName: string): Promise<string> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = join(__dirname, '..', 'templates', 'nodejs', 'nestjs', templateName);
    try {
      return await FileUtils.readFile(templatePath);
    } catch (error) {
      console.warn(`Template ${templateName} not found, using fallback`);
      return this.getFallbackTemplate(templateName);
    }
  }

  private getFallbackTemplate(templateName: string): string {
    // Fallback templates for critical files
    switch (templateName) {
      case 'main.ts.hbs':
        return `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen({{microservice.port}});
}
bootstrap();`;
      
      case 'app.module.ts.hbs':
        return `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}`;
      
      default:
        return '// Template not found';
    }
  }

  // Utility methods
  private sanitizeEndpointName(path: string): string {
    return path
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  private getTypeScriptType(type: string): string {
    switch (type?.toLowerCase()) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      case 'object': return 'any';
      default: return 'any';
    }
  }

  private getMockValue(type: string): string {
    switch (type) {
      case 'String': return "'test-string'";
      case 'Number': return '123';
      case 'Boolean': return 'true';
      case 'Object': return '{}';
      default: return "'test-value'";
    }
  }

  // Add next steps for post-generation
  private addDefaultNextSteps(): void {
    this.addNextStep(`Navigate to output/${this.specification.microservice.name}`);
    this.addNextStep('Configure environment variables in .env file');
    this.addNextStep("Run 'npm install' to install dependencies");
    this.addNextStep("Run 'npm run build' to verify compilation");
    this.addNextStep("Run 'npm test' to run tests");
    this.addNextStep(`Test endpoint: ${this.specification.endpoints[0]?.method} ${this.specification.endpoints[0]?.path}`);
  }
}
