import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  ValidationRequest, 
  ValidationReport, 
  OrchestrationResult, 
  MCPValidatorInfo, 
  TechnologyType,
  MicroserviceProject 
} from '../types/index.js';
import { TechnologyDetector } from '../detectors/technology-detector.js';

export class StandardsOrchestrator {
  private technologyDetector: TechnologyDetector;
  private validators: Map<TechnologyType, MCPValidatorInfo>;

  constructor() {
    this.technologyDetector = new TechnologyDetector();
    this.validators = new Map();
    this.initializeValidators();
  }

  private initializeValidators(): void {
    // Configurar validadores MCP disponibles
    this.validators.set('nodejs', {
      technology: 'nodejs',
      name: 'nodejs-standards-validator',
      path: 'C:/MCP/demo/demo-mcp-3-standards-validator_nodejs',
      command: 'node',
      args: ['dist/index.js'],
      available: false
    });

    this.validators.set('java', {
      technology: 'java',
      name: 'java-standards-validator',
      path: 'C:/MCP/demo/demo-mcp-3-standards-validator_java',
      command: 'node',
      args: ['dist/index.js'],
      available: false
    });

    // Placeholder para futuros validadores
    this.validators.set('dotnet', {
      technology: 'dotnet',
      name: 'dotnet-standards-validator',
      path: 'C:/MCP/demo/demo-mcp-3-standards-validator_dotnet',
      command: 'node',
      args: ['dist/index.js'],
      available: false
    });
  }

  async validateMicroservice(request: ValidationRequest): Promise<OrchestrationResult> {
    const startTime = Date.now();
    
    console.error(`[StandardsOrchestrator] Iniciando validación de: ${request.projectPath}`);

    try {
      // 1. Detectar tecnología del microservicio
      const technologyResult = await this.technologyDetector.detectTechnology(request.projectPath);
      
      if (technologyResult.technology === 'unknown' || technologyResult.confidence < 30) {
        return {
          success: false,
          error: `No se pudo determinar la tecnología del microservicio. Confianza: ${technologyResult.confidence}%`,
          executionTime: Date.now() - startTime
        };
      }

      // 2. Obtener información del proyecto
      const project = await this.extractProjectInfo(request.projectPath, technologyResult);

      // 3. Verificar disponibilidad del validador
      const validator = this.validators.get(technologyResult.technology);
      if (!validator) {
        return {
          success: false,
          error: `No hay validador disponible para la tecnología: ${technologyResult.technology}`,
          executionTime: Date.now() - startTime
        };
      }

      // 4. Verificar que el validador esté disponible
      const isValidatorAvailable = await this.checkValidatorAvailability(validator);
      if (!isValidatorAvailable) {
        return {
          success: false,
          error: `El validador para ${technologyResult.technology} no está disponible en ${validator.path}`,
          executionTime: Date.now() - startTime
        };
      }

      console.error(`[StandardsOrchestrator] Delegando a validador: ${validator.name}`);

      // 5. Delegar validación al MCP especializado
      const validationReport = await this.delegateValidation(validator, project, request);

      return {
        success: true,
        validationReport,
        delegatedTo: validator,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      console.error(`[StandardsOrchestrator] Error durante orquestación:`, error);
      return {
        success: false,
        error: `Error durante la orquestación: ${error}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  private async extractProjectInfo(projectPath: string, technologyResult: any): Promise<MicroserviceProject> {
    const projectName = path.basename(projectPath);
    
    let version = '1.0.0';
    let description = 'Microservicio a validar';

    try {
      // Extraer información específica según la tecnología
      switch (technologyResult.technology) {
        case 'nodejs':
          const packageInfo = await this.extractNodeJSInfo(projectPath);
          version = packageInfo.version || version;
          description = packageInfo.description || description;
          break;
          
        case 'java':
          const javaInfo = await this.extractJavaInfo(projectPath);
          version = javaInfo.version || version;
          description = javaInfo.description || description;
          break;
      }
    } catch (error) {
      console.error(`[StandardsOrchestrator] Error extrayendo info del proyecto:`, error);
    }

    return {
      name: projectName,
      path: projectPath,
      technology: technologyResult.technology,
      version,
      description
    };
  }

  private async extractNodeJSInfo(projectPath: string): Promise<{ version?: string; description?: string }> {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      
      return {
        version: packageJson.version,
        description: packageJson.description
      };
    } catch {
      return {};
    }
  }

  private async extractJavaInfo(projectPath: string): Promise<{ version?: string; description?: string }> {
    try {
      // Intentar extraer de pom.xml
      const pomPath = path.join(projectPath, 'pom.xml');
      if (await this.fileExists(pomPath)) {
        const pomContent = await fs.readFile(pomPath, 'utf-8');
        
        const versionMatch = pomContent.match(/<version>([^<]+)<\/version>/);
        const descriptionMatch = pomContent.match(/<description>([^<]+)<\/description>/);
        const nameMatch = pomContent.match(/<name>([^<]+)<\/name>/);
        
        return {
          version: versionMatch?.[1],
          description: descriptionMatch?.[1] || nameMatch?.[1]
        };
      }
      
      return {};
    } catch {
      return {};
    }
  }

  private async checkValidatorAvailability(validator: MCPValidatorInfo): Promise<boolean> {
    try {
      // Verificar que el directorio del validador existe
      const validatorExists = await this.directoryExists(validator.path);
      if (!validatorExists) {
        console.error(`[StandardsOrchestrator] Directorio del validador no existe: ${validator.path}`);
        return false;
      }

      // Verificar que el archivo ejecutable existe
      const executablePath = path.join(validator.path, validator.args[0]);
      const executableExists = await this.fileExists(executablePath);
      if (!executableExists) {
        console.error(`[StandardsOrchestrator] Ejecutable del validador no existe: ${executablePath}`);
        return false;
      }

      validator.available = true;
      return true;
    } catch (error) {
      console.error(`[StandardsOrchestrator] Error verificando disponibilidad del validador:`, error);
      return false;
    }
  }

  private async delegateValidation(
    validator: MCPValidatorInfo,
    project: MicroserviceProject,
    request: ValidationRequest
  ): Promise<ValidationReport> {
    
    return new Promise((resolve, reject) => {
      console.error(`[StandardsOrchestrator] Ejecutando validador: ${validator.command} ${validator.args.join(' ')}`);
      
      const child = spawn(validator.command, validator.args, {
        cwd: validator.path,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      // Enviar solicitud de validación al MCP
      const validationRequest = {
        method: 'tools/call',
        params: {
          name: 'validate-microservice',
          arguments: {
            projectPath: project.path,
            standards: request.standards,
            outputPath: request.outputPath
          }
        }
      };

      child.stdin.write(JSON.stringify(validationRequest) + '\n');
      child.stdin.end();

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          try {
            // Parsear respuesta del MCP
            const response = this.parseValidationResponse(stdout, project);
            resolve(response);
          } catch (error) {
            console.error(`[StandardsOrchestrator] Error parseando respuesta:`, error);
            reject(new Error(`Error parseando respuesta del validador: ${error}`));
          }
        } else {
          console.error(`[StandardsOrchestrator] Validador falló con código: ${code}`);
          console.error(`[StandardsOrchestrator] STDERR: ${stderr}`);
          reject(new Error(`Validador falló con código ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        console.error(`[StandardsOrchestrator] Error ejecutando validador:`, error);
        reject(new Error(`Error ejecutando validador: ${error.message}`));
      });
    });
  }

  private parseValidationResponse(stdout: string, project: MicroserviceProject): ValidationReport {
    try {
      // Intentar parsear respuesta JSON del MCP
      const lines = stdout.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const response = JSON.parse(line);
          if (response.content && response.content[0] && response.content[0].text) {
            const validationData = JSON.parse(response.content[0].text);
            
            if (validationData.overallScore !== undefined) {
              return validationData as ValidationReport;
            }
          }
        } catch {
          // Continuar con la siguiente línea
        }
      }
      
      // Si no se puede parsear, crear reporte de error
      return this.createErrorReport(project, 'No se pudo parsear la respuesta del validador');
      
    } catch (error) {
      console.error(`[StandardsOrchestrator] Error parseando respuesta:`, error);
      return this.createErrorReport(project, `Error parseando respuesta: ${error}`);
    }
  }

  private createErrorReport(project: MicroserviceProject, errorMessage: string): ValidationReport {
    return {
      project,
      timestamp: new Date().toISOString(),
      overallScore: 0,
      overallStatus: 'FAILED',
      categories: [],
      recommendations: [{
        priority: 'HIGH',
        category: 'System',
        title: 'Error de Validación',
        description: errorMessage,
        action: 'Verificar configuración del validador',
        impact: 'No se pudo completar la validación',
        effort: 'Medium'
      }],
      summary: {
        totalRules: 0,
        passedRules: 0,
        failedRules: 1,
        warningRules: 0,
        skippedRules: 0,
        securityIssues: 0,
        performanceIssues: 0
      },
      executionTime: 0
    };
  }

  async listAvailableValidators(): Promise<MCPValidatorInfo[]> {
    const validators = Array.from(this.validators.values());
    
    // Verificar disponibilidad de cada validador
    for (const validator of validators) {
      validator.available = await this.checkValidatorAvailability(validator);
    }
    
    return validators;
  }

  async getValidatorInfo(technology: TechnologyType): Promise<MCPValidatorInfo | undefined> {
    const validator = this.validators.get(technology);
    if (validator) {
      validator.available = await this.checkValidatorAvailability(validator);
    }
    return validator;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }
}