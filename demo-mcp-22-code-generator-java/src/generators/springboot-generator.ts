import { promises as fs } from 'fs';
import path from 'path';
import { 
  MicroserviceSpecification, 
  RepositoryAnalysis, 
  GenerationReport,
  SpringBootProject 
} from '../types/index.js';
import { SpecAnalyzer } from '../analyzers/spec-analyzer.js';
import { TemplateEngine } from '../templates/template-engine.js';

export class SpringBootGenerator {
  private templateEngine: TemplateEngine;
  private specAnalyzer: SpecAnalyzer;
  
  constructor() {
    this.templateEngine = new TemplateEngine();
    this.specAnalyzer = new SpecAnalyzer();
  }
  
  async generateMicroservice(
    spec: MicroserviceSpecification,
    outputPath: string,
    basePackage: string,
    repositories: RepositoryAnalysis[]
  ): Promise<GenerationReport> {
    console.error(`[SpringBootGenerator] Generando microservicio: ${spec.microservice.name}`);
    
    const report: GenerationReport = {
      timestamp: new Date().toISOString(),
      specification: spec.microservice.name,
      outputPath,
      filesGenerated: 0,
      structureCreated: [],
      dependencies: [],
      endpoints: [],
      errors: [],
      warnings: []
    };
    
    try {
      // Crear proyecto Spring Boot
      const project = this.createSpringBootProject(spec, basePackage);
      
      // Crear estructura de directorios
      await this.createProjectStructure(outputPath, project, report);
      
      // Generar archivos principales
      await this.generateMainFiles(outputPath, project, spec, report);
      
      // Generar controllers
      await this.generateControllers(outputPath, project, spec, report);
      
      // Generar services
      await this.generateServices(outputPath, project, spec, report);
      
      // Generar repositories
      await this.generateRepositories(outputPath, project, spec, report);
      
      // Generar entities/domain models
      await this.generateDomainModels(outputPath, project, spec, report);
      
      // Generar DTOs
      await this.generateDTOs(outputPath, project, spec, report);
      
      // Generar configuración
      await this.generateConfiguration(outputPath, project, spec, report);
      
      // Generar tests
      await this.generateTests(outputPath, project, spec, report);
      
      // Generar archivos de deployment
      await this.generateDeploymentFiles(outputPath, project, spec, report);
      
      console.error(`[SpringBootGenerator] Generación completada: ${report.filesGenerated} archivos`);
      return report;
      
    } catch (error) {
      console.error(`[SpringBootGenerator] Error durante la generación:`, error);
      report.errors.push(`Error general: ${error}`);
      return report;
    }
  }
  
  private createSpringBootProject(spec: MicroserviceSpecification, basePackage: string): SpringBootProject {
    const serviceName = this.specAnalyzer.extractJavaPackageName(spec.microservice.name);
    
    return {
      name: spec.microservice.name,
      basePackage: `${basePackage}.${serviceName}`,
      database: spec.database,
      port: spec.microservice.port,
      dependencies: this.specAnalyzer.inferSpringBootDependencies(spec),
      profiles: ['dev', 'test', 'prod']
    };
  }
  
  private async createProjectStructure(
    outputPath: string, 
    project: SpringBootProject,
    report: GenerationReport
  ): Promise<void> {
    const directories = [
      '',
      'src',
      'src/main',
      'src/main/java',
      'src/main/resources',
      'src/test',
      'src/test/java',
      'docs',
      'docker',
      'k8s',
      ...this.getJavaPackageDirectories(project.basePackage)
    ];
    
    for (const dir of directories) {
      const fullPath = path.join(outputPath, dir);
      await fs.mkdir(fullPath, { recursive: true });
      report.structureCreated.push(dir || 'root');
    }
  }
  
  private getJavaPackageDirectories(basePackage: string): string[] {
    const packagePath = basePackage.replace(/\./g, '/');
    const basePath = `src/main/java/${packagePath}`;
    const testPath = `src/test/java/${packagePath}`;
    
    return [
      basePath,
      `${basePath}/application`,
      `${basePath}/application/config`,
      `${basePath}/application/exceptions`,
      `${basePath}/application/security`,
      `${basePath}/domain`,
      `${basePath}/domain/entities`,
      `${basePath}/domain/repositories`,
      `${basePath}/domain/services`,
      `${basePath}/infrastructure`,
      `${basePath}/infrastructure/config`,
      `${basePath}/infrastructure/external`,
      `${basePath}/infrastructure/persistence`,
      `${basePath}/infrastructure/web`,
      `${basePath}/infrastructure/web/controllers`,
      `${basePath}/infrastructure/web/dto`,
      `${basePath}/infrastructure/web/mappers`,
      `${basePath}/shared`,
      `${basePath}/shared/constants`,
      `${basePath}/shared/utils`,
      `${testPath}`,
      `${testPath}/integration`,
      `${testPath}/unit`
    ];
  }
  
  private async generateMainFiles(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    // pom.xml
    const pomContent = await this.templateEngine.renderPomXml(project, spec);
    await this.writeFile(path.join(outputPath, 'pom.xml'), pomContent, report);
    
    // README.md
    const readmeContent = await this.templateEngine.renderReadme(project, spec);
    await this.writeFile(path.join(outputPath, 'README.md'), readmeContent, report);
    
    // Application main class
    const mainClassPath = this.getJavaFilePath(outputPath, project.basePackage, 
      this.specAnalyzer.extractJavaClassName(project.name) + 'Application');
    const mainClassContent = await this.templateEngine.renderMainClass(project, spec);
    await this.writeFile(mainClassPath, mainClassContent, report);
  }
  
  private async generateControllers(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    const endpoints = this.specAnalyzer.analyzeEndpoints(spec);
    
    // Agrupar endpoints por controller
    const controllerGroups = new Map<string, any[]>();
    
    for (const endpoint of endpoints) {
      const controllerName = endpoint.className;
      if (!controllerGroups.has(controllerName)) {
        controllerGroups.set(controllerName, []);
      }
      controllerGroups.get(controllerName)!.push(endpoint);
      report.endpoints.push(`${endpoint.method} ${endpoint.path}`);
    }
    
    // Generar cada controller
    for (const [controllerName, endpointList] of controllerGroups) {
      const controllerPath = this.getJavaFilePath(
        outputPath, 
        `${project.basePackage}.infrastructure.web.controllers`, 
        controllerName
      );
      
      const controllerContent = await this.templateEngine.renderController(
        controllerName, 
        endpointList, 
        project, 
        spec
      );
      
      await this.writeFile(controllerPath, controllerContent, report);
    }
  }
  
  private async generateServices(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    const serviceName = this.specAnalyzer.extractJavaClassName(spec.microservice.name.replace('-service', ''));
    const serviceClassName = `${serviceName}Service`;
    
    const servicePath = this.getJavaFilePath(
      outputPath,
      `${project.basePackage}.domain.services`,
      serviceClassName
    );
    
    const serviceContent = await this.templateEngine.renderService(
      serviceClassName,
      project,
      spec
    );
    
    await this.writeFile(servicePath, serviceContent, report);
  }
  
  private async generateRepositories(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    // Generar repositorios basados en las integraciones de base de datos
    for (const integration of spec.integrations) {
      if (integration.type.toLowerCase().includes('base de datos') || 
          integration.type.toLowerCase().includes('database')) {
        
        const entityName = this.extractEntityNameFromIntegration(integration.name);
        const repositoryName = `${entityName}Repository`;
        
        const repositoryPath = this.getJavaFilePath(
          outputPath,
          `${project.basePackage}.domain.repositories`,
          repositoryName
        );
        
        const repositoryContent = await this.templateEngine.renderRepository(
          repositoryName,
          entityName,
          project,
          spec
        );
        
        await this.writeFile(repositoryPath, repositoryContent, report);
      }
    }
  }
  
  private async generateDomainModels(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    // Generar entidades basadas en las integraciones
    for (const integration of spec.integrations) {
      if (integration.type.toLowerCase().includes('base de datos')) {
        const entityName = this.extractEntityNameFromIntegration(integration.name);
        
        const entityPath = this.getJavaFilePath(
          outputPath,
          `${project.basePackage}.domain.entities`,
          entityName
        );
        
        const entityContent = await this.templateEngine.renderEntity(
          entityName,
          project,
          spec,
          integration
        );
        
        await this.writeFile(entityPath, entityContent, report);
      }
    }
  }
  
  private async generateDTOs(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    const endpoints = this.specAnalyzer.analyzeEndpoints(spec);
    
    for (const endpoint of endpoints) {
      // Request DTO
      if (endpoint.requestBody && endpoint.requestBody.length > 0) {
        const requestDtoName = this.specAnalyzer.extractJavaClassName(
          endpoint.path.split('/').pop() || 'Request'
        ) + 'Request';
        
        const requestDtoPath = this.getJavaFilePath(
          outputPath,
          `${project.basePackage}.infrastructure.web.dto`,
          requestDtoName
        );
        
        const requestDtoContent = await this.templateEngine.renderRequestDTO(
          requestDtoName,
          endpoint.requestBody,
          project
        );
        
        await this.writeFile(requestDtoPath, requestDtoContent, report);
      }
      
      // Response DTO (opcional - se puede usar entity directamente)
    }
  }
  
  private async generateConfiguration(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    // Database configuration
    const dbConfigPath = this.getJavaFilePath(
      outputPath,
      `${project.basePackage}.infrastructure.config`,
      'DatabaseConfig'
    );
    
    const dbConfigContent = await this.templateEngine.renderDatabaseConfig(project, spec);
    await this.writeFile(dbConfigPath, dbConfigContent, report);
    
    // Security configuration
    if (spec.security?.authentication) {
      const securityConfigPath = this.getJavaFilePath(
        outputPath,
        `${project.basePackage}.application.security`,
        'SecurityConfig'
      );
      
      const securityConfigContent = await this.templateEngine.renderSecurityConfig(project, spec);
      await this.writeFile(securityConfigPath, securityConfigContent, report);
    }
    
    // Application properties
    for (const profile of project.profiles) {
      const propsFileName = profile === 'dev' ? 'application.yml' : `application-${profile}.yml`;
      const propsPath = path.join(outputPath, 'src', 'main', 'resources', propsFileName);
      const propsContent = await this.templateEngine.renderApplicationProperties(project, spec, profile);
      await this.writeFile(propsPath, propsContent, report);
    }
  }
  
  private async generateTests(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    // Integration tests
    const integrationTestPath = this.getJavaFilePath(
      outputPath,
      `${project.basePackage}.integration`,
      'ApplicationIntegrationTest',
      true
    );
    
    const integrationTestContent = await this.templateEngine.renderIntegrationTest(project, spec);
    await this.writeFile(integrationTestPath, integrationTestContent, report);
    
    // Unit tests para services
    const serviceName = this.specAnalyzer.extractJavaClassName(spec.microservice.name.replace('-service', ''));
    const serviceTestPath = this.getJavaFilePath(
      outputPath,
      `${project.basePackage}.unit`,
      `${serviceName}ServiceTest`,
      true
    );
    
    const serviceTestContent = await this.templateEngine.renderServiceTest(serviceName, project, spec);
    await this.writeFile(serviceTestPath, serviceTestContent, report);
  }
  
  private async generateDeploymentFiles(
    outputPath: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    report: GenerationReport
  ): Promise<void> {
    // Dockerfile
    const dockerfilePath = path.join(outputPath, 'docker', 'Dockerfile');
    const dockerfileContent = await this.templateEngine.renderDockerfile(project, spec);
    await this.writeFile(dockerfilePath, dockerfileContent, report);
    
    // Docker Compose
    const dockerComposePath = path.join(outputPath, 'docker-compose.yml');
    const dockerComposeContent = await this.templateEngine.renderDockerCompose(project, spec);
    await this.writeFile(dockerComposePath, dockerComposeContent, report);
    
    // Kubernetes manifests
    for (const profile of ['dev', 'prod']) {
      const k8sPath = path.join(outputPath, 'k8s', `deployment-${profile}.yaml`);
      const k8sContent = await this.templateEngine.renderKubernetesDeployment(project, spec, profile);
      await this.writeFile(k8sPath, k8sContent, report);
    }
  }
  
  private getJavaFilePath(
    outputPath: string, 
    packageName: string, 
    className: string, 
    isTest: boolean = false
  ): string {
    const packagePath = packageName.replace(/\./g, '/');
    const fileName = `${className}.java`;
    return path.join(outputPath, 'src', isTest ? 'test' : 'main', 'java', packagePath, fileName);
  }
  
  private async writeFile(filePath: string, content: string, report: GenerationReport): Promise<void> {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
      report.filesGenerated++;
      console.error(`[SpringBootGenerator] Archivo generado: ${path.basename(filePath)}`);
    } catch (error) {
      const errorMsg = `Error escribiendo archivo ${filePath}: ${error}`;
      console.error(`[SpringBootGenerator] ${errorMsg}`);
      report.errors.push(errorMsg);
    }
  }
  
  private extractEntityNameFromIntegration(integrationName: string): string {
    // Convertir nombre de integración a nombre de entidad
    // Ej: "prc_consultarestadocc_app" -> "ConsultaEstadoCc"
    return integrationName
      .replace(/^prc_/, '') // Remover prefijo de procedimiento
      .replace(/_app$/, '') // Remover sufijo
      .split('_')
      .map(part => this.specAnalyzer.extractJavaClassName(part))
      .join('');
  }
}