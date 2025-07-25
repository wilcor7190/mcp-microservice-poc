import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import mammoth from "mammoth";
import fs from "fs/promises";
import path from "path";
import xlsx from "node-xlsx";

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
    summary?: string;
  };
  database: string;
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
    parameters: string[];
    responses: Array<{
      status: number;
      description: string;
    }>;
    examples?: any;
    inputParameters?: any[];
    outputParameters?: any[];
    validationRules?: any[];
  }>;
  integrations: Array<{
    name: string;
    type: string;
    connection: string;
    description: string;
    configuration?: string;
    legacyServices?: any[];
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
  technicalDetails?: {
    changeType?: string;
    hut?: string;
    deployment?: any;
    environments?: string[];
  };
  businessValue?: string;
}

class DocumentProcessor {
  async processDocument(filePath: string): Promise<MicroserviceSpecification> {
    console.log(`🤖 MCP 1: Procesando documento: ${filePath}`);
    
    const ext = path.extname(filePath).toLowerCase();
    let content = "";
    
    // Procesar según tipo de archivo
    switch (ext) {
      case '.docx':
        const result = await mammoth.extractRawText({ path: filePath });
        content = result.value;
        break;
      case '.xlsx':
      case '.xls':
        return await this.processExcelSpecification(filePath);
      case '.txt':
      case '.csv':
        content = await fs.readFile(filePath, 'utf-8');
        return this.parseCSVSpecification(content, path.basename(filePath));
      default:
        throw new Error(`Tipo de archivo no soportado: ${ext}`);
    }
    
    // Para archivos de texto, usar el método anterior
    return this.extractSpecificationsFromText(content, path.basename(filePath));
  }

  private async processExcelSpecification(filePath: string): Promise<MicroserviceSpecification> {
    console.log("📊 MCP 1: Procesando Excel con especificaciones técnicas...");
    
    const workbook = xlsx.parse(filePath);
    const fileName = path.basename(filePath);
    
    // Hoja 1: Información General del Servicio
    const serviceData = workbook[0]?.data || [];
    
    // Hoja 2: Detalles de Endpoints y API
    let endpointsData: any[][] = [];
    if (workbook.length > 1) {
      endpointsData = workbook[1]?.data || [];
    }
    
    // Hoja 3: Primer Servicio Legado (prc_consultarestadocc_app)
    let legacyService1Data: any[][] = [];
    if (workbook.length > 2) {
      legacyService1Data = workbook[2]?.data || [];
    }
    
    // Hoja 4: Segundo Servicio Legado (prc_reglascambiociclo_app)
    let legacyService2Data: any[][] = [];
    if (workbook.length > 3) {
      legacyService2Data = workbook[3]?.data || [];
    }
    
    // Combinar datos de servicios legados para procesamiento de integraciones
    const combinedIntegrationsData = [...legacyService1Data, ...legacyService2Data];
    
    return this.buildSpecificationFromSheets(serviceData, endpointsData, combinedIntegrationsData, fileName);
  }

  private parseCSVSpecification(content: string, fileName: string): MicroserviceSpecification {
    console.log("� MCP 1: Procesando CSV con especificaciones técnicas...");
    
    const lines = content.split('\n').map(line => line.split(','));
    const serviceData = lines.slice(0, 2); // Primeras 2 líneas para servicio
    
    // Buscar sección de endpoints
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
    
    // Extraer información detallada del servicio de la primera hoja
    const serviceInfo = this.extractServiceInfo(serviceData);
    const serviceName = serviceInfo.name || this.extractServiceNameFromFile(fileName);
    
    // Procesar endpoints
    const endpoints = this.processEndpoints(endpointsData);
    
    // Procesar integraciones
    const integrations = this.processIntegrations(integrationsData);
    
    // Detectar base de datos
    const database = this.detectDatabase(integrations);
    
    return {
      metadata: {
        sourceFile: fileName,
        processedAt: new Date().toISOString(),
        version: "1.0.0"
      },
      microservice: {
        name: serviceName,
        description: serviceInfo.description,
        version: serviceInfo.version,
        port: serviceInfo.port,
        team: serviceInfo.team,
        repository: serviceInfo.repository,
        summary: serviceInfo.summary
      },
      database,
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
      },
      technicalDetails: serviceInfo.technicalDetails,
      businessValue: serviceInfo.businessValue
    };
  }

  private processEndpoints(endpointsData: any[][]): Array<{
    method: string;
    path: string;
    description: string;
    parameters: string[];
    responses: Array<{ status: number; description: string; }>;
    examples?: any;
    inputParameters?: any[];
    outputParameters?: any[];
    validationRules?: any[];
  }> {
    const endpoints = [];
    
    if (endpointsData.length > 1) {
      // Buscar información principal del endpoint
      let mainEndpoint: any = null;
      let inputParams: any[] = [];
      let outputParams: any[] = [];
      let responses: any[] = [];
      let examples: any = {};
      
      for (let i = 0; i < endpointsData.length; i++) {
        const row = endpointsData[i];
        if (!row[0]) continue;
        
        const key = row[0]?.toString().toLowerCase().trim();
        
        // Extraer URI y método principal
        if (key.startsWith('/ms/') || key.includes('resource/uri')) {
          const uri = row[1]?.toString() || row[0]?.toString();
          const method = row[2]?.toString() || 'GET';
          const description = row[3]?.toString() || 'Endpoint principal del microservicio';
          
          mainEndpoint = {
            method: method.toUpperCase(),
            path: uri,
            description,
            parameters: [],
            responses: []
          };
        }
        
        // Procesar parámetros de entrada
        if (key === 'min' || key === 'custcode' || key === 'coid' || 
            (i > 0 && endpointsData[i-1] && endpointsData[i-1][0]?.toString().toLowerCase().includes('entrada'))) {
          if (row[1] && row[2] && row[3]) {
            inputParams.push({
              name: key,
              type: row[1]?.toString() || 'String',
              required: row[2]?.toString() === 'S' || row[2]?.toString() === 'Y',
              description: row[3]?.toString() || `Parámetro ${key}`
            });
          }
        }
        
        // Procesar parámetros de salida
        if (key.startsWith('data') || key === 'responsecode' || key === 'message' || 
            key === 'transactionid' || key === 'legacy' || key === 'timestamp') {
          if (row[1] && row[2]) {
            outputParams.push({
              name: key,
              type: row[1]?.toString() || 'String',
              required: row[2]?.toString() === 'S' || row[2]?.toString() === 'Y',
              description: row[3]?.toString() || `Campo de respuesta ${key}`
            });
          }
        }
        
        // Procesar códigos de respuesta HTTP
        const statusMatch = key.match(/(\d{3})/);
        if (statusMatch) {
          const status = parseInt(statusMatch[1]);
          const description = row[1]?.toString() || row[2]?.toString() || 'Response';
          responses.push({ status, description });
        }
        
        // Procesar ejemplos JSON
        if (row[1]?.toString().includes('{') || key.includes('json response')) {
          const exampleKey = key.includes('200') ? 'success' : 
                            key.includes('400') ? 'badRequest' :
                            key.includes('404') ? 'notFound' :
                            key.includes('500') ? 'serverError' : 'default';
          examples[exampleKey] = row[1]?.toString();
        }
      }
      
      // Crear endpoint principal si se encontró
      if (mainEndpoint) {
        mainEndpoint.inputParameters = inputParams;
        mainEndpoint.outputParameters = outputParams;
        mainEndpoint.examples = examples;
        
        // Agregar respuestas estándar si no se encontraron
        if (responses.length === 0) {
          responses = [
            { status: 200, description: "Operación exitosa" },
            { status: 400, description: "Error en la validación de datos" },
            { status: 404, description: "Recurso no encontrado" },
            { status: 500, description: "Error interno del servidor" },
            { status: 504, description: "Timeout de conexión al legado" }
          ];
        }
        
        mainEndpoint.responses = responses;
        mainEndpoint.parameters = inputParams.map(p => p.name);
        
        endpoints.push(mainEndpoint);
      }
    }
    
    // Agregar endpoints por defecto si no hay datos
    if (endpoints.length === 0) {
      endpoints.push({
        method: "GET",
        path: "/MS/CUS/CustomerBill/MSCusBillPeriodQueryM/v1.0/QueryCicleChangeStatusCusBil",
        description: "Operación para administrar las solicitudes de registro de programación, cancelación y consulta de cambio de ciclo para clientes pospago móvil",
        parameters: ["min", "custCode", "coId"],
        responses: [
          { status: 200, description: "Operación exitosa" },
          { status: 400, description: "Error en la validación de datos" },
          { status: 404, description: "Recurso no encontrado" },
          { status: 500, description: "Error interno del servidor" }
        ],
        inputParameters: [
          { name: "min", type: "Number", required: false, description: "Número del min del cliente" },
          { name: "custCode", type: "String", required: false, description: "Código del cliente" },
          { name: "coId", type: "Number", required: false, description: "Contrato del cliente" }
        ]
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
    legacyServices?: any[];
  }> {
    const integrations = [];
    
    if (integrationsData.length > 1) {
      let currentService: any = null;
      let inputMapping: any[] = [];
      let outputMapping: any[] = [];
      
      for (let i = 0; i < integrationsData.length; i++) {
        const row = integrationsData[i];
        if (!row[0]) continue;
        
        const key = row[0]?.toString().toLowerCase().trim();
        
        // Detectar inicio de nuevo servicio legado
        if (key === 'nombre de servicio legado') {
          // Si ya tenemos un servicio, agregarlo
          if (currentService) {
            currentService.inputMapping = inputMapping;
            currentService.outputMapping = outputMapping;
            integrations.push({
              name: currentService.name,
              type: currentService.type || 'database',
              connection: currentService.connection || 'database-connection',
              description: currentService.description,
              configuration: currentService.configuration,
              legacyServices: [currentService]
            });
          }
          
          // Iniciar nuevo servicio
          currentService = {
            name: row[1]?.toString() || 'legacy-service',
            description: '',
            type: '',
            urls: {},
            configuration: ''
          };
          inputMapping = [];
          outputMapping = [];
        }
        
        // Extraer información del servicio actual
        if (currentService) {
          if (key === 'descripción') {
            currentService.description = row[1]?.toString() || '';
          }
          
          if (key === 'tipo') {
            currentService.type = row[1]?.toString() || 'database';
          }
          
          if (key === 'objeto bd *') {
            currentService.configuration = row[1]?.toString() || '';
          }
          
          // Extraer URLs por ambiente
          if (key.startsWith('url ')) {
            const env = key.replace('url ', '').toUpperCase();
            const url = row[1]?.toString() || '';
            if (url && url !== '') {
              currentService.urls[env] = url;
            }
          }
          
          // Procesar mapeo de entrada
          if (i > 0 && integrationsData[i-1] && 
              integrationsData[i-1][0]?.toString().toLowerCase().includes('mapeo request')) {
            if (row[1] && row[2] && row[3]) {
              inputMapping.push({
                microserviceField: key,
                legacyField: row[1]?.toString(),
                description: row[2]?.toString(),
                type: row[3]?.toString(),
                required: row[4]?.toString() === 'S'
              });
            }
          }
          
          // Procesar mapeo de salida
          if (i > 0 && integrationsData[i-1] && 
              integrationsData[i-1][0]?.toString().toLowerCase().includes('mapeo response')) {
            if (row[1] && row[2] && row[3]) {
              outputMapping.push({
                legacyField: key,
                microserviceField: row[1]?.toString(),
                description: row[2]?.toString(),
                type: row[3]?.toString(),
                required: row[4]?.toString() === 'S'
              });
            }
          }
        }
      }
      
      // Agregar el último servicio
      if (currentService) {
        currentService.inputMapping = inputMapping;
        currentService.outputMapping = outputMapping;
        
        // Determinar conexión principal
        const qaUrl = currentService.urls.QA || '';
        const connection = qaUrl || currentService.configuration || 'database-connection';
        
        integrations.push({
          name: currentService.name,
          type: currentService.type || 'database',
          connection: connection,
          description: currentService.description,
          configuration: currentService.configuration,
          legacyServices: [currentService]
        });
      }
    }
    
    // Agregar integraciones por defecto si no hay datos
    if (integrations.length === 0) {
      integrations.push({
        name: "prc_consultarestadocc_app",
        type: "database",
        connection: "BSCSQA=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=132.147.170.98)(PORT=1750)))(CONNECT_DATA=(SERVICE_NAME=BSCSQA)))",
        description: "Procedimiento para consultar el estado de solicitudes de cambio de ciclo"
      }, {
        name: "prc_reglascambiociclo_app", 
        type: "database",
        connection: "BSCSQA=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=132.147.170.98)(PORT=1750)))(CONNECT_DATA=(SERVICE_NAME=BSCSQA)))",
        description: "Procedimiento para validar que el cliente cumpla con las condiciones y reglas para poder gestionar el cambio de ciclo"
      });
    }
    
    return integrations;
  }

  private detectDatabase(integrations: any[]): string {
    // Detectar base de datos desde las integraciones
    for (const integration of integrations) {
      const connection = integration.connection?.toLowerCase() || '';
      
      // Detectar Oracle por patrones comunes
      if (connection.includes('oracle') || 
          connection.includes('bscs') || 
          connection.includes('sid=') || 
          connection.includes('service_name=') ||
          connection.includes('1521') || 
          connection.includes('1750')) {
        return 'oracle';
      }
      
      // Otros detectores
      if (connection.includes('mysql')) return 'mysql';
      if (connection.includes('mongodb')) return 'mongodb';
      if (connection.includes('postgresql') || connection.includes('postgres')) return 'postgresql';
      if (connection.includes('sqlserver') || connection.includes('mssql')) return 'sqlserver';
    }
    
    // Por defecto Oracle si hay integraciones de BD pero no se detecta
    const hasDbIntegration = integrations.some(i => 
      i.type?.toLowerCase().includes('base de datos') || 
      i.type?.toLowerCase().includes('database')
    );
    
    return hasDbIntegration ? 'oracle' : 'postgresql';
  }

  private extractServiceNameFromFile(fileName: string): string {
    // Extraer nombre del servicio del nombre del archivo
    const baseName = path.parse(fileName).name;
    return baseName
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase()
      .replace(/^[^a-z]+/, '')
      + '-service';
  }

  private extractServiceInfo(serviceData: any[][]): {
    name: string;
    description: string;
    version: string;
    port: number;
    team: string;
    repository: string;
    summary?: string;
    technicalDetails?: any;
    businessValue?: string;
  } {
    let name = "";
    let description = "MicroServicio";
    let summary = "";
    let businessValue = "";
    let technicalDetails: any = {
      changeType: "",
      hut: "",
      deployment: {},
      environments: [],
      namespace: "",
      platform: "",
      capacity: "",
      automation: "",
      connectivity: "",
      repository: {
        exists: false,
        organization: "",
        url: "",
        branch: ""
      },
      apiGateway: {
        exists: false,
        configuration: ""
      }
    };
    
    // Recorrer todas las filas para extraer información
    for (const row of serviceData) {
      if (!row || row.length === 0) continue;
      
      const key = row[0]?.toString().toLowerCase().trim();
      const value = row[1]?.toString() || "";
      const description2 = row[2]?.toString() || "";
      const value2 = row[3]?.toString() || "";
      
      // Extraer nombre del servicio
      if (key === 'nombre' || key === 'name') {
        name = value;
      }
      
      // Extraer descripción detallada
      if (key === 'descripción' || key === 'description' || description2?.toLowerCase() === 'descripción') {
        summary = value2 || value;
        if (summary.length > 50) {
          businessValue = summary;
        }
      }
      
      // Extraer tipo de cambio
      if (key === 'tipo de cambio' || key === 'change type') {
        technicalDetails.changeType = value;
      }
      
      // Extraer HUT
      if (key === 'hut') {
        technicalDetails.hut = description2 || value;
      }
      
      // Extraer plataforma
      if (key === 'plataforma (hls)' || key === 'platform') {
        technicalDetails.platform = value;
      }
      
      // Extraer namespace/dominio
      if (key === 'name space / dominio' || key === 'namespace') {
        technicalDetails.namespace = value;
        // Extraer ambientes del namespace
        if (value.includes('DEV')) technicalDetails.environments.push('DEV');
        if (value.includes('QA')) technicalDetails.environments.push('QA');
        if (value.includes('PROD')) technicalDetails.environments.push('PROD');
        if (value.includes('UAT')) technicalDetails.environments.push('UAT');
        if (value.includes('SIT')) technicalDetails.environments.push('SIT');
      }
      
      // Extraer capacidad para despliegue
      if (key === 'capacidad para despliegue') {
        technicalDetails.capacity = value;
      }
      
      // Extraer automatización de despliegue
      if (key === 'automatización despliegue' || description2?.toLowerCase().includes('automatización')) {
        technicalDetails.automation = value2 || value;
      }
      
      // Extraer conectividad legados
      if (key === 'existe conectividad legados en ambientes') {
        technicalDetails.connectivity = value;
      }
      
      // Extraer información del repositorio
      if (key === 'existe repositorio') {
        technicalDetails.repository.exists = value.toLowerCase() === 'si' || value.toLowerCase() === 'yes';
      }
      
      if (key === 'organización') {
        technicalDetails.repository.organization = value;
      }
      
      if (key === 'url repo') {
        technicalDetails.repository.url = value;
      }
      
      if (key === 'rama') {
        technicalDetails.repository.branch = value;
      }
      
      // Extraer información de API Gateway
      if (key === 'existe configuración') {
        technicalDetails.apiGateway.exists = value.toLowerCase() === 'si' || value.toLowerCase() === 'yes';
      }
      
      // Extraer información de despliegue
      if (key === 'despliegue' || key === 'deployment') {
        technicalDetails.deployment = { 
          type: value, 
          details: value2,
          platform: technicalDetails.platform 
        };
      }
    }
    
    // Generar nombre si no se encontró
    if (!name) {
      name = "MSCusBillPeriodQueryM";
    }
    
    // Generar descripción completa
    if (!description && summary) {
      description = summary.length > 100 ? summary.substring(0, 100) + "..." : summary;
    } else if (!description) {
      description = `Microservicio ${name}`;
    }
    
    return {
      name: name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-service',
      description,
      version: "1.0.0",
      port: 3001,
      team: "Backend Team",
      repository: technicalDetails.repository.url || `https://github.com/company/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-service`,
      summary: businessValue || summary || `Microservicio para ${name}`,
      technicalDetails,
      businessValue: businessValue || summary
    };
  }
  
  private extractSpecificationsFromText(content: string, fileName: string): MicroserviceSpecification {
    console.log("🔍 MCP 1: Extrayendo especificaciones de texto...");
    
    // Método anterior como fallback
    const serviceName = this.extractServiceNameFromFile(fileName);
    
    return {
      metadata: {
        sourceFile: fileName,
        processedAt: new Date().toISOString(),
        version: "1.0.0"
      },
      microservice: {
        name: serviceName,
        description: `Microservicio ${serviceName} extraído de documentación`,
        version: "1.0.0",
        port: 3001,
        team: "Backend Team"
      },
      database: "oracle",
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/health",
          description: "Health check del microservicio",
          parameters: [],
          responses: [{ status: 200, description: "Servicio funcionando" }]
        }
      ],
      integrations: [
        {
          name: "primary-database",
          type: "database",
          connection: "postgresql://localhost:5432/microservice_db",
          description: "Base de datos principal"
        }
      ],
      security: {
        authentication: "JWT",
        authorization: "RBAC",
        cors: true
      },
      configuration: {
        environment: ["dev", "test", "prod"],
        secrets: ["db-password", "jwt-secret"],
        configMaps: ["app-config"]
      }
    };
  }
}

// Configurar servidor MCP
const server = new Server(
  {
    name: "demo-document-processor",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Registrar herramientas MCP
server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      {
        name: "process_microservice_specification",
        description: "Procesa especificaciones técnicas de microservicios desde Excel y genera JSON estructurado",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Ruta al archivo Excel (.xlsx) con la especificación técnica del microservicio"
            }
          },
          required: ["filePath"]
        }
      },
      {
        name: "analyze_input_folder",
        description: "Analiza todos los archivos Excel en la carpeta input-specifications",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "process_specification_compact",
        description: "Procesa especificación de microservicio en formato compacto (ahorra tokens)",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Ruta al archivo Excel (.xlsx) - genera JSON minificado"
            }
          },
          required: ["filePath"]
        }
      }
    ]
  })
);

server.setRequestHandler(
  CallToolRequestSchema,
  async (request: any) => {
    if (request.params.name === "process_microservice_specification") {
      const { filePath } = request.params.arguments as { filePath: string };
      
      try {
        const processor = new DocumentProcessor();
        
        // Si filePath es relativo, hacerlo absoluto basado en el proyecto
        let absoluteFilePath = filePath;
        if (!path.isAbsolute(filePath)) {
          const projectRoot = 'c:\\MCP\\demo\\demo-mcp-1-document-processor';
          absoluteFilePath = path.join(projectRoot, 'input-specifications', filePath);
        }
        
        const specification = await processor.processDocument(absoluteFilePath);
        
        // Generar nombre de archivo de salida basado en el servicio
        const outputFileName = `${specification.microservice.name}-specification.json`;
        const projectRoot = 'c:\\MCP\\demo\\demo-mcp-1-document-processor';
        const outputPath = path.join(projectRoot, 'output-json', outputFileName);
        
        await fs.mkdir(path.join(projectRoot, 'output-json'), { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(specification, null, 2));
        
        return {
          content: [
            {
              type: "text",
              text: `✅ MCP 1: Especificación técnica procesada exitosamente!

📄 **Especificación extraída:**
- **Servicio:** ${specification.microservice.name}
- **Descripción:** ${specification.microservice.description}
- **Puerto:** ${specification.microservice.port}
- **Equipo:** ${specification.microservice.team}
- **Endpoints:** ${specification.endpoints.length} endpoints detectados
- **Integraciones:** ${specification.integrations.length} sistemas integrados
- **Base de datos:** ${specification.database}

💾 **Guardado en:** ${outputPath}

🔄 **Listo para siguiente MCP:** El archivo JSON está preparado para la generación de código`
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text", 
              text: `❌ MCP 1 Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
    
    if (request.params.name === "analyze_input_folder") {
      try {
        const projectRoot = 'c:\\MCP\\demo\\demo-mcp-1-document-processor';
        const inputFolder = path.join(projectRoot, 'input-specifications');
        const files = await fs.readdir(inputFolder);
        const excelFiles = files.filter((f: string) => f.endsWith('.xlsx') || f.endsWith('.xls'));
        
        let results = `📂 **Análisis de carpeta input-specifications:**\n\n`;
        results += `📁 **Carpeta:** ${inputFolder}\n`;
        results += `📄 **Archivos encontrados:** ${files.length} total, ${excelFiles.length} Excel\n\n`;
        
        if (excelFiles.length === 0) {
          results += `⚠️ No se encontraron archivos Excel (.xlsx/.xls) para procesar.\n`;
          results += `💡 Coloca tus especificaciones técnicas en esta carpeta y usa la herramienta 'process_microservice_specification'.`;
        } else {
          results += `📋 **Archivos Excel disponibles:**\n`;
          excelFiles.forEach((file: string) => {
            results += `   - ${file}\n`;
          });
          results += `\n💡 Usa 'process_microservice_specification' con la ruta completa de cualquier archivo.`;
        }
        
        return {
          content: [
            {
              type: "text",
              text: results
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error analizando carpeta: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
    
    throw new Error(`Herramienta desconocida: ${request.params.name}`);
  }
);

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("🤖 MCP 1: Document Processor iniciado y listo!");
}

// Solo ejecutar si es el archivo principal
main().catch(console.error);

// Exportar para uso en otros archivos
export { DocumentProcessor, MicroserviceSpecification };
