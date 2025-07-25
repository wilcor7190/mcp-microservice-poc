import { promises as fs } from 'fs';
import path from 'path';
import { MicroserviceSpecification } from '../types/index.js';

export class SpecAnalyzer {
  
  async analyzeSpecifications(specificationsPath: string): Promise<MicroserviceSpecification[]> {
    console.error(`[SpecAnalyzer] Analizando especificaciones en: ${specificationsPath}`);
    
    try {
      const files = await fs.readdir(specificationsPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const specifications: MicroserviceSpecification[] = [];
      
      for (const file of jsonFiles) {
        const filePath = path.join(specificationsPath, file);
        const spec = await this.loadSpecification(filePath);
        specifications.push(spec);
      }
      
      console.error(`[SpecAnalyzer] ${specifications.length} especificaciones cargadas`);
      return specifications;
      
    } catch (error) {
      console.error(`[SpecAnalyzer] Error analizando especificaciones:`, error);
      return [];
    }
  }
  
  async loadSpecification(filePath: string): Promise<MicroserviceSpecification> {
    console.error(`[SpecAnalyzer] Cargando especificación: ${filePath}`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const spec = JSON.parse(content) as MicroserviceSpecification;
      
      // Validar estructura básica
      this.validateSpecification(spec);
      
      console.error(`[SpecAnalyzer] Especificación cargada: ${spec.microservice.name}`);
      return spec;
      
    } catch (error) {
      console.error(`[SpecAnalyzer] Error cargando especificación ${filePath}:`, error);
      throw new Error(`No se pudo cargar la especificación: ${error}`);
    }
  }
  
  private validateSpecification(spec: MicroserviceSpecification): void {
    if (!spec.microservice?.name) {
      throw new Error('La especificación debe tener un nombre de microservicio');
    }
    
    if (!spec.endpoints || spec.endpoints.length === 0) {
      throw new Error('La especificación debe tener al menos un endpoint');
    }
    
    if (!spec.database) {
      throw new Error('La especificación debe especificar el tipo de base de datos');
    }
  }
  
  extractJavaPackageName(serviceName: string): string {
    // Convertir nombre del servicio a nombre de paquete Java válido
    return serviceName
      .toLowerCase()
      .replace(/[-_]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  }
  
  extractJavaClassName(name: string): string {
    // Convertir a PascalCase para nombres de clase Java
    return name
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  }
  
  inferSpringBootDependencies(spec: MicroserviceSpecification): string[] {
    const dependencies = [
      'spring-boot-starter-web',
      'spring-boot-starter-actuator',
      'spring-boot-starter-validation',
      'lombok'
    ];
    
    // Base de datos
    switch (spec.database.toLowerCase()) {
      case 'oracle':
        dependencies.push('spring-boot-starter-data-jpa', 'ojdbc8');
        break;
      case 'postgresql':
        dependencies.push('spring-boot-starter-data-jpa', 'postgresql');
        break;
      case 'mysql':
        dependencies.push('spring-boot-starter-data-jpa', 'mysql-connector-java');
        break;
      case 'mongodb':
        dependencies.push('spring-boot-starter-data-mongodb');
        break;
      default:
        dependencies.push('spring-boot-starter-data-jpa');
    }
    
    // Seguridad
    if (spec.security?.authentication?.toLowerCase().includes('jwt')) {
      dependencies.push('spring-boot-starter-security', 'jjwt-api', 'jjwt-impl', 'jjwt-jackson');
    }
    
    // Testing
    dependencies.push('spring-boot-starter-test', 'junit-jupiter');
    
    // Swagger/OpenAPI
    dependencies.push('springdoc-openapi-starter-webmvc-ui');
    
    return dependencies;
  }
  
  analyzeEndpoints(spec: MicroserviceSpecification) {
    return spec.endpoints.map(endpoint => ({
      method: endpoint.method.toUpperCase(),
      path: endpoint.path,
      description: endpoint.description,
      operationId: this.generateOperationId(endpoint.method, endpoint.path),
      requestBody: endpoint.inputParameters || [],
      responses: endpoint.responses,
      className: this.extractControllerClassName(endpoint.path),
      methodName: this.extractMethodName(endpoint.method, endpoint.path)
    }));
  }
  
  private generateOperationId(method: string, path: string): string {
    const pathSegments = path.split('/').filter(segment => segment && !segment.startsWith('{'));
    const lastSegment = pathSegments[pathSegments.length - 1] || 'operation';
    return method.toLowerCase() + this.extractJavaClassName(lastSegment);
  }
  
  private extractControllerClassName(path: string): string {
    const pathSegments = path.split('/').filter(segment => segment && !segment.startsWith('{'));
    const relevantSegment = pathSegments.find(segment => 
      !['api', 'v1', 'v2', 'MS', 'CUS'].includes(segment)
    ) || pathSegments[pathSegments.length - 1] || 'Default';
    
    return this.extractJavaClassName(relevantSegment) + 'Controller';
  }
  
  private extractMethodName(method: string, path: string): string {
    const pathSegments = path.split('/').filter(segment => segment && !segment.startsWith('{'));
    const lastSegment = pathSegments[pathSegments.length - 1] || 'operation';
    
    const methodPrefix = method.toLowerCase();
    const operation = this.camelCase(lastSegment);
    
    return methodPrefix + operation.charAt(0).toUpperCase() + operation.slice(1);
  }
  
  private camelCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word, index) => 
        index === 0 ? word.toLowerCase() : 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }
}