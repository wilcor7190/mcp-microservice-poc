import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';

// Copiar la interfaz y clase para el demo
interface MicroserviceSpecification {
  metadata: {
    sourceFile: string;
    processedAt: string;
    version: string;
  };
  microservice: {
    name: string;
    description: string;
    version: string;
    port: number;
    team?: string;
    repository?: string;
  };
  architecture: {
    pattern: string;
    layers: string[];
    database?: string;
    framework?: string;
  };
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
    parameters: string[];
    responses: Array<{
      status: number;
      description: string;
    }>;
  }>;
  integrations: Array<{
    name: string;
    type: string;
    connection: string;
    description: string;
    configuration?: string;
  }>;
  security: {
    authentication?: string;
    authorization?: string;
    cors: boolean;
  };
  configuration: {
    environment: string[];
    secrets: string[];
    configMaps: string[];
  };
}

class DocumentProcessor {
  async processDocument(filePath: string): Promise<MicroserviceSpecification> {
    console.log(`🤖 MCP 1: Procesando documento: ${filePath}`);
    
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.xlsx':
      case '.xls':
        return await this.processExcelSpecification(filePath);
      case '.txt':
      case '.csv':
        const content = await fs.readFile(filePath, 'utf-8');
        return this.parseCSVSpecification(content, path.basename(filePath));
      default:
        throw new Error(`Tipo de archivo no soportado: ${ext}`);
    }
  }

  private async processExcelSpecification(filePath: string): Promise<MicroserviceSpecification> {
    console.log("📊 MCP 1: Procesando Excel con especificaciones técnicas...");
    
    const workbook = XLSX.readFile(filePath);
    const fileName = path.basename(filePath);
    
    // Hoja 1: Información General del Servicio
    const serviceSheet = workbook.Sheets[workbook.SheetNames[0]];
    const serviceData = XLSX.utils.sheet_to_json(serviceSheet, { header: 1 }) as any[][];
    
    // Hoja 2: Endpoints (si existe)
    let endpointsData: any[][] = [];
    if (workbook.SheetNames.length > 1) {
      const endpointsSheet = workbook.Sheets[workbook.SheetNames[1]];
      endpointsData = XLSX.utils.sheet_to_json(endpointsSheet, { header: 1 }) as any[][];
    }
    
    // Hoja 3: Integraciones (si existe)
    let integrationsData: any[][] = [];
    if (workbook.SheetNames.length > 2) {
      const integrationsSheet = workbook.Sheets[workbook.SheetNames[2]];
      integrationsData = XLSX.utils.sheet_to_json(integrationsSheet, { header: 1 }) as any[][];
    }
    
    return this.buildSpecificationFromSheets(serviceData, endpointsData, integrationsData, fileName);
  }

  private parseCSVSpecification(content: string, fileName: string): MicroserviceSpecification {
    const lines = content.split('\n').map(line => line.split(','));
    const serviceData = lines.slice(0, 2);
    
    const endpointsStart = lines.findIndex(line => line[0]?.toLowerCase().includes('método') || line[0]?.toLowerCase().includes('method'));
    const integrationsStart = lines.findIndex(line => line[0]?.toLowerCase().includes('sistema') || line[0]?.toLowerCase().includes('system'));
    
    const endpointsData = endpointsStart !== -1 ? lines.slice(endpointsStart, integrationsStart !== -1 ? integrationsStart : undefined) : [];
    const integrationsData = integrationsStart !== -1 ? lines.slice(integrationsStart) : [];
    
    return this.buildSpecificationFromSheets(serviceData, endpointsData, integrationsData, fileName);
  }

  private buildSpecificationFromSheets(
    serviceData: any[][],
    endpointsData: any[][],
    integrationsData: any[][],
    fileName: string
  ): MicroserviceSpecification {
    
    const headers = serviceData[0] || [];
    const values = serviceData[1] || [];
    
    const serviceName = values[0] || this.extractServiceNameFromFile(fileName);
    const description = values[1] || `Microservicio ${serviceName}`;
    const version = values[2] || "1.0.0";
    const port = parseInt(values[3]) || 3001;
    const team = values[4] || "Backend Team";
    const repository = values[5] || `https://github.com/company/${serviceName}`;
    
    const endpoints = this.processEndpoints(endpointsData);
    const integrations = this.processIntegrations(integrationsData);
    const architecture = this.detectArchitecture(serviceName, integrations);
    
    return {
      metadata: {
        sourceFile: fileName,
        processedAt: new Date().toISOString(),
        version: "1.0.0"
      },
      microservice: {
        name: serviceName,
        description,
        version,
        port,
        team,
        repository
      },
      architecture,
      endpoints,
      integrations,
      security: {
        authentication: "JWT",
        authorization: "RBAC",
        cors: true
      },
      configuration: {
        environment: ["dev", "test", "prod"],
        secrets: ["db-password", "jwt-secret", "api-key"],
        configMaps: ["app-config", "logging-config"]
      }
    };
  }

  private processEndpoints(endpointsData: any[][]): Array<{
    method: string;
    path: string;
    description: string;
    parameters: string[];
    responses: Array<{ status: number; description: string; }>;
  }> {
    const endpoints: Array<{
      method: string;
      path: string;
      description: string;
      parameters: string[];
      responses: Array<{ status: number; description: string; }>;
    }> = [];
    
    if (endpointsData.length > 1) {
      for (let i = 1; i < endpointsData.length; i++) {
        const row = endpointsData[i];
        if (!row[0] || row[0].trim() === '') continue;
        
        const method = row[0]?.toUpperCase() || 'GET';
        const path = row[1] || '/api/v1/resource';
        const description = row[2] || 'Endpoint description';
        const parameters = row[3] ? row[3].split(';').map((p: string) => p.trim()) : [];
        const responseText = row[4] || '200: Success';
        
        const responses = [];
        const responseMatch = responseText.match(/(\d+):\s*(.+)/);
        if (responseMatch) {
          responses.push({
            status: parseInt(responseMatch[1]),
            description: responseMatch[2]
          });
        } else {
          responses.push({ status: 200, description: 'Success' });
        }
        
        endpoints.push({
          method,
          path,
          description,
          parameters,
          responses
        });
      }
    }
    
    if (endpoints.length === 0) {
      endpoints.push({
        method: "GET",
        path: "/api/v1/health",
        description: "Health check del microservicio",
        parameters: [],
        responses: [{ status: 200, description: "Servicio funcionando correctamente" }]
      });
    }
    
    return endpoints;
  }

  private processIntegrations(integrationsData: any[][]): Array<{
    name: string;
    type: string;
    connection: string;
    description: string;
    configuration?: string;
  }> {
    const integrations: Array<{
      name: string;
      type: string;
      connection: string;
      description: string;
      configuration?: string;
    }> = [];
    
    if (integrationsData.length > 1) {
      for (let i = 1; i < integrationsData.length; i++) {
        const row = integrationsData[i];
        if (!row[0] || row[0].trim() === '') continue;
        
        integrations.push({
          name: row[0] || 'external-system',
          type: row[1] || 'rest-api',
          connection: row[2] || 'https://external-system.com/api',
          description: row[3] || 'External system integration',
          configuration: row[4] || undefined
        });
      }
    }
    
    if (integrations.length === 0) {
      integrations.push({
        name: "primary-database",
        type: "database",
        connection: "postgresql://localhost:5432/microservice_db",
        description: "Base de datos principal del microservicio"
      });
    }
    
    return integrations;
  }

  private detectArchitecture(serviceName: string, integrations: any[]): {
    pattern: string;
    layers: string[];
    database?: string;
    framework?: string;
  } {
    const dbIntegration = integrations.find(i => i.type === 'database');
    let database = 'postgresql';
    if (dbIntegration) {
      if (dbIntegration.connection.includes('mysql')) database = 'mysql';
      else if (dbIntegration.connection.includes('mongodb')) database = 'mongodb';
      else if (dbIntegration.connection.includes('oracle')) database = 'oracle';
    }
    
    let framework = 'spring-boot';
    if (serviceName.includes('node') || serviceName.includes('js')) framework = 'nodejs-express';
    else if (serviceName.includes('python')) framework = 'fastapi';
    else if (serviceName.includes('go')) framework = 'gin';
    
    return {
      pattern: "hexagonal",
      layers: ["controller", "service", "repository", "domain"],
      database,
      framework
    };
  }

  private extractServiceNameFromFile(fileName: string): string {
    const baseName = path.parse(fileName).name;
    return baseName
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase()
      .replace(/^[^a-z]+/, '')
      + '-service';
  }
}

async function demonstrateMCP() {
  console.log('🚀 Demostración del MCP Document Processor\n');
  
  const processor = new DocumentProcessor();
  
  // Procesar el archivo de ejemplo más completo
  const exampleFile = 'input-specifications/user-management-service-spec.xlsx';
  
  try {
    console.log(`📄 Procesando: ${exampleFile}`);
    console.log('━'.repeat(50));
    
    const specification = await processor.processDocument(exampleFile);
    
    // Generar archivo de salida
    const outputFile = `output-json/${specification.microservice.name}-specification.json`;
    await fs.mkdir('output-json', { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify(specification, null, 2));
    
    console.log('✅ Procesamiento completado!\n');
    
    // Mostrar resumen
    console.log('📊 RESUMEN DE LA ESPECIFICACIÓN:');
    console.log('━'.repeat(50));
    console.log(`🔧 Servicio: ${specification.microservice.name}`);
    console.log(`📝 Descripción: ${specification.microservice.description}`);
    console.log(`🏷️  Versión: ${specification.microservice.version}`);
    console.log(`🔌 Puerto: ${specification.microservice.port}`);
    console.log(`👥 Equipo: ${specification.microservice.team}`);
    console.log(`📂 Repositorio: ${specification.microservice.repository}`);
    console.log(`🏗️  Arquitectura: ${specification.architecture.pattern} con ${specification.architecture.framework}`);
    console.log(`🗄️  Base de datos: ${specification.architecture.database}`);
    console.log(`📡 Endpoints: ${specification.endpoints.length} definidos`);
    console.log(`🔗 Integraciones: ${specification.integrations.length} sistemas`);
    
    console.log('\n📡 ENDPOINTS DETECTADOS:');
    console.log('━'.repeat(50));
    specification.endpoints.forEach((endpoint, index) => {
      console.log(`${index + 1}. ${endpoint.method} ${endpoint.path}`);
      console.log(`   📝 ${endpoint.description}`);
      if (endpoint.parameters.length > 0) {
        console.log(`   📋 Parámetros: ${endpoint.parameters.join(', ')}`);
      }
      console.log(`   ✅ Respuesta: ${endpoint.responses[0]?.status} - ${endpoint.responses[0]?.description}`);
      console.log('');
    });
    
    console.log('🔗 INTEGRACIONES DETECTADAS:');
    console.log('━'.repeat(50));
    specification.integrations.forEach((integration, index) => {
      console.log(`${index + 1}. ${integration.name} (${integration.type})`);
      console.log(`   📝 ${integration.description}`);
      console.log(`   🔌 Conexión: ${integration.connection}`);
      if (integration.configuration) {
        console.log(`   ⚙️  Configuración: ${integration.configuration}`);
      }
      console.log('');
    });
    
    console.log(`💾 Archivo JSON generado: ${outputFile}`);
    console.log(`📊 Tamaño del JSON: ${(await fs.stat(outputFile)).size} bytes`);
    
    console.log('\n🎯 SIGUIENTE PASO:');
    console.log('━'.repeat(50));
    console.log('El archivo JSON generado está listo para ser usado por el siguiente MCP');
    console.log('que generará el código del microservicio basado en esta especificación.');
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Ejecutar demostración
demonstrateMCP().catch(console.error);
