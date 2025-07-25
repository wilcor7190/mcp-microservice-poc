import { FileUtils } from '../utils/file-utils.js';
import { MicroserviceSpecification } from '../types/index.js';

export class SpecAnalyzer {
  private specification: MicroserviceSpecification | null = null;
  
  async loadSpecification(specPath: string): Promise<MicroserviceSpecification> {
    try {
      console.log(`Loading specification from: ${specPath}`);
      this.specification = await FileUtils.readJsonFile<MicroserviceSpecification>(specPath);
      this.validateSpecification();
      return this.specification;
    } catch (error) {
      throw new Error(`Failed to load specification: ${error}`);
    }
  }

  async analyzeSpecification(inputDir: string): Promise<MicroserviceSpecification> {
    // Try both 'specification' and 'specifications' directories
    let specPath = FileUtils.joinPaths(inputDir, 'specification', 'microservice-spec.json');
    
    if (!(await FileUtils.fileExists(specPath))) {
      specPath = FileUtils.joinPaths(inputDir, 'specifications', 'microservice-spec.json');
    }
    
    if (!(await FileUtils.fileExists(specPath))) {
      // Try to find any JSON file in specification directory (singular)
      let specFiles = await FileUtils.findFiles('*.json', FileUtils.joinPaths(inputDir, 'specification'));
      if (specFiles.length === 0) {
        // Try to find any JSON file in specifications directory (plural)
        specFiles = await FileUtils.findFiles('*.json', FileUtils.joinPaths(inputDir, 'specifications'));
        if (specFiles.length === 0) {
          throw new Error('No specification file found in specification or specifications directory');
        }
        return await this.loadSpecification(FileUtils.joinPaths(inputDir, 'specifications', specFiles[0]));
      }
      return await this.loadSpecification(FileUtils.joinPaths(inputDir, 'specification', specFiles[0]));
    }
    
    return await this.loadSpecification(specPath);
  }

  private validateSpecification(): void {
    if (!this.specification) {
      throw new Error('No specification loaded');
    }

    const required = ['metadata', 'microservice', 'endpoints'];
    const missing = required.filter(field => !this.specification![field as keyof MicroserviceSpecification]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields in specification: ${missing.join(', ')}`);
    }

    // Validate database field (either directly or in architecture)
    if (!this.specification.database && !this.specification.architecture?.database) {
      throw new Error('Database configuration is required (either as "database" field or "architecture.database")');
    }

    // Validate microservice metadata
    if (!this.specification.microservice.name) {
      throw new Error('Microservice name is required');
    }

    if (!this.specification.microservice.port || this.specification.microservice.port <= 0) {
      throw new Error('Valid microservice port is required');
    }

    // Validate endpoints
    if (!Array.isArray(this.specification.endpoints) || this.specification.endpoints.length === 0) {
      throw new Error('At least one endpoint is required');
    }

    for (const endpoint of this.specification.endpoints) {
      if (!endpoint.method || !endpoint.path) {
        throw new Error('Endpoint method and path are required');
      }
    }
  }

  getFrameworkRequirements(): string[] {
    if (!this.specification) return [];

    const requirements: string[] = [];

    // Base framework dependencies
    requirements.push('@nestjs/core', '@nestjs/common', '@nestjs/platform-express');

    // Database dependencies
    const dbType = this.specification.architecture?.database || this.specification.database || 'postgresql';
    switch (dbType) {
      case 'oracle':
        requirements.push('oracledb', '@nestjs/typeorm', 'typeorm');
        break;
      case 'postgresql':
        requirements.push('pg', '@types/pg', '@nestjs/typeorm', 'typeorm');
        break;
      case 'mysql':
        requirements.push('mysql2', '@nestjs/typeorm', 'typeorm');
        break;
      case 'mongodb':
        requirements.push('@nestjs/mongoose', 'mongoose');
        break;
    }

    // Security dependencies
    if (this.specification.security) {
      if (this.specification.security.authentication === 'JWT') {
        requirements.push('@nestjs/jwt', '@nestjs/passport', 'passport-jwt');
      }
      if (this.specification.security.cors) {
        requirements.push('cors', '@types/cors');
      }
    }

    // Testing dependencies
    requirements.push('jest', '@types/jest', 'supertest', '@types/supertest');

    return requirements;
  }

  getDevDependencies(): string[] {
    return [
      '@nestjs/cli',
      '@nestjs/schematics',
      '@nestjs/testing',
      '@types/express',
      '@types/node',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'prettier',
      'source-map-support',
      'ts-jest',
      'ts-loader',
      'ts-node',
      'tsconfig-paths',
      'typescript'
    ];
  }

  generatePackageJson(): Record<string, any> {
    if (!this.specification) {
      throw new Error('No specification loaded');
    }

    const dependencies = this.getFrameworkRequirements();
    const devDependencies = this.getDevDependencies();

    return {
      name: this.specification.microservice.name,
      version: this.specification.microservice.version || '1.0.0',
      description: this.specification.microservice.description || '',
      author: this.specification.microservice.team || '',
      private: true,
      license: 'UNLICENSED',
      scripts: {
        prebuild: 'rimraf dist',
        build: 'nest build',
        format: 'prettier --write "src/**/*.ts" "test/**/*.ts"',
        start: 'nest start',
        'start:dev': 'nest start --watch',
        'start:debug': 'nest start --debug --watch',
        'start:prod': 'node dist/main',
        lint: 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:cov': 'jest --coverage',
        'test:debug': 'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
        'test:e2e': 'jest --config ./test/jest-e2e.json'
      },
      dependencies: this.createDependencyObject(dependencies),
      devDependencies: this.createDependencyObject(devDependencies, true),
      jest: {
        moduleFileExtensions: ['js', 'json', 'ts'],
        rootDir: 'src',
        testRegex: '.*\\.spec\\.ts$',
        transform: {
          '^.+\\.(t|j)s$': 'ts-jest'
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: '../coverage',
        testEnvironment: 'node'
      }
    };
  }

  private createDependencyObject(dependencies: string[], isDev = false): Record<string, string> {
    const versionMap: Record<string, string> = {
      // NestJS
      '@nestjs/core': '^10.0.0',
      '@nestjs/common': '^10.0.0',
      '@nestjs/platform-express': '^10.0.0',
      '@nestjs/cli': '^10.0.0',
      '@nestjs/schematics': '^10.0.0',
      '@nestjs/testing': '^10.0.0',
      '@nestjs/typeorm': '^10.0.0',
      '@nestjs/mongoose': '^10.0.2',
      '@nestjs/jwt': '^10.1.1',
      '@nestjs/passport': '^10.0.2',
      
      // Database
      'oracledb': '^6.0.0',
      'pg': '^8.11.3',
      'mysql2': '^3.6.0',
      'mongoose': '^7.5.0',
      'typeorm': '^0.3.17',
      
      // Security
      'passport-jwt': '^4.0.1',
      'cors': '^2.8.5',
      
      // Testing
      'jest': '^29.5.0',
      'supertest': '^6.3.3',
      'ts-jest': '^29.1.0',
      
      // TypeScript & Tools
      'typescript': '^5.1.3',
      'ts-node': '^10.9.0',
      'ts-loader': '^9.4.3',
      'tsconfig-paths': '^4.2.0',
      'eslint': '^8.42.0',
      'prettier': '^2.8.8',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      'eslint-config-prettier': '^8.8.0',
      'eslint-plugin-prettier': '^4.2.1',
      'source-map-support': '^0.5.21',
      'rimraf': '^5.0.1',
      
      // Types
      '@types/express': '^4.17.17',
      '@types/node': '^20.3.1',
      '@types/jest': '^29.5.2',
      '@types/supertest': '^2.0.12',
      '@types/cors': '^2.8.13',
      '@types/pg': '^8.10.2'
    };

    const result: Record<string, string> = {};
    
    for (const dep of dependencies) {
      result[dep] = versionMap[dep] || 'latest';
    }

    return result;
  }

  getEndpointsByMethod(): Record<string, any[]> {
    if (!this.specification) return {};

    const grouped: Record<string, any[]> = {};
    
    for (const endpoint of this.specification.endpoints) {
      if (!grouped[endpoint.method]) {
        grouped[endpoint.method] = [];
      }
      grouped[endpoint.method].push(endpoint);
    }

    return grouped;
  }

  getDatabaseConnectionConfig(): Record<string, any> {
    if (!this.specification) return {};

    const config: Record<string, any> = {
      type: this.specification.architecture?.database || this.specification.database || 'postgresql',
      host: '${DB_HOST}',
      port: '${DB_PORT}',
      username: '${DB_USERNAME}',
      password: '${DB_PASSWORD}',
      database: '${DB_NAME}',
      synchronize: false,
      logging: true
    };

    const dbType = this.specification.architecture?.database || this.specification.database || 'postgresql';
    switch (dbType) {
      case 'oracle':
        config.port = '${DB_PORT:1521}';
        config.serviceName = '${DB_SERVICE_NAME}';
        break;
      case 'postgresql':
        config.port = '${DB_PORT:5432}';
        config.ssl = '${DB_SSL:false}';
        break;
      case 'mysql':
        config.port = '${DB_PORT:3306}';
        break;
      case 'mongodb':
        return {
          uri: '${MONGODB_URI}',
          useNewUrlParser: true,
          useUnifiedTopology: true
        };
    }

    return config;
  }

  getSecurityConfig(): Record<string, any> {
    if (!this.specification?.security) return {};

    const config: Record<string, any> = {};

    if (this.specification.security.authentication === 'JWT') {
      config.jwt = {
        secret: '${JWT_SECRET}',
        signOptions: { expiresIn: '1h' }
      };
    }

    if (this.specification.security.cors) {
      config.cors = {
        origin: '${CORS_ORIGIN:*}',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
      };
    }

    return config;
  }

  getSpecification(): MicroserviceSpecification | null {
    return this.specification;
  }
}
