import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { JavaProject, ValidationResult } from '../types/index.js';

export class SecurityValidator {

  async checkVulnerabilities(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando vulnerabilidades en proyecto Java: ${project.name}`);
      
      // Ejecutar dependency check según build tool
      const vulnerabilities = project.buildTool === 'maven' ? 
        await this.runMavenDependencyCheck(project.path) :
        await this.runGradleDependencyCheck(project.path);
      
      if (vulnerabilities.total === 0) {
        return {
          status: 'PASSED',
          message: 'No se encontraron vulnerabilidades conocidas',
          score: 100,
          suggestions: ['Ejecutar dependency check regularmente en CI/CD']
        };
      }

      const criticalAndHigh = vulnerabilities.critical + vulnerabilities.high;
      
      if (criticalAndHigh > 0) {
        return {
          status: 'FAILED',
          message: `${criticalAndHigh} vulnerabilidades críticas/altas encontradas`,
          score: Math.max(0, 100 - (criticalAndHigh * 25)),
          suggestions: [
            'Actualizar dependencias vulnerables inmediatamente',
            'Usar mvn versions:display-dependency-updates',
            'Implementar OWASP Dependency Check en pipeline'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `${vulnerabilities.medium + vulnerabilities.low} vulnerabilidades menores`,
        score: Math.max(60, 100 - (vulnerabilities.medium * 5) - (vulnerabilities.low * 2)),
        suggestions: ['Revisar y actualizar dependencias cuando sea posible']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo ejecutar dependency check',
        score: 0,
        suggestions: ['Verificar que Maven/Gradle estén disponibles']
      };
    }
  }

  async checkSpringSecurityConfig(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando configuración Spring Security: ${project.name}`);
      
      if (project.framework !== 'spring-boot') {
        return {
          status: 'INFO',
          message: 'No es un proyecto Spring Boot',
          score: 80,
          suggestions: []
        };
      }

      const hasSpringSecurity = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'spring-boot-starter-security'
      );

      if (!hasSpringSecurity) {
        return {
          status: 'WARNING',
          message: 'Spring Security no está configurado',
          score: 40,
          suggestions: [
            'Agregar spring-boot-starter-security',
            'Configurar SecurityFilterChain',
            'Implementar autenticación y autorización'
          ]
        };
      }

      const securityConfig = await this.checkSecurityConfiguration(project.path);
      
      if (securityConfig.hasConfig && securityConfig.hasEndpointSecurity) {
        return {
          status: 'PASSED',
          message: 'Spring Security configurado correctamente',
          score: 100,
          suggestions: ['Revisar configuración periódicamente']
        };
      }

      return {
        status: 'WARNING',
        message: 'Spring Security parcialmente configurado',
        score: 60,
        suggestions: [
          'Crear clase @Configuration con SecurityFilterChain',
          'Configurar autenticación HTTP Basic o JWT',
          'Definir autorización por endpoints'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar Spring Security',
        score: 0
      };
    }
  }

  async checkInputValidation(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando validación de input: ${project.name}`);
      
      const hasValidation = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'spring-boot-starter-validation' ||
        dep.artifactId === 'hibernate-validator'
      );

      if (!hasValidation) {
        return {
          status: 'FAILED',
          message: 'Bean Validation no está configurado',
          score: 0,
          suggestions: [
            'Agregar spring-boot-starter-validation',
            'Usar @Valid en controllers',
            'Crear DTOs con @NotNull, @Size, etc.'
          ]
        };
      }

      const validationUsage = await this.checkValidationUsage(project.path);
      
      if (validationUsage.controllersWithValidation >= validationUsage.totalControllers * 0.8) {
        return {
          status: 'PASSED',
          message: `Validación implementada en ${validationUsage.controllersWithValidation}/${validationUsage.totalControllers} controllers`,
          score: 100,
          suggestions: ['Continuar usando @Valid en todos los endpoints']
        };
      }

      return {
        status: 'WARNING',
        message: `Validación parcial: ${validationUsage.controllersWithValidation}/${validationUsage.totalControllers} controllers`,
        score: 60,
        suggestions: [
          'Agregar @Valid a parámetros de métodos',
          'Crear DTO classes con validation annotations',
          'Implementar @ControllerAdvice para manejo de errores'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar validación de input',
        score: 0
      };
    }
  }

  async checkSecretsExternalization(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando externalización de secrets: ${project.name}`);
      
      const hardcodedSecrets = await this.scanForHardcodedSecrets(project.path);
      
      if (hardcodedSecrets.length === 0) {
        return {
          status: 'PASSED',
          message: 'No se encontraron secrets hardcodeados',
          score: 100,
          suggestions: [
            'Continuar usando application.properties para configuración',
            'Usar variables de entorno para secrets en producción'
          ]
        };
      }

      return {
        status: 'FAILED',
        message: `${hardcodedSecrets.length} posibles secrets hardcodeados`,
        score: Math.max(0, 100 - (hardcodedSecrets.length * 20)),
        details: hardcodedSecrets.slice(0, 5).map(secret => ({
          file: secret.file,
          line: secret.line,
          message: `Posible secret: ${secret.pattern}`,
          severity: 'ERROR' as const
        })),
        suggestions: [
          'Mover secrets a application.properties',
          'Usar @Value("${property}") para inyección',
          'Configurar profiles para diferentes entornos'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar externalización de secrets',
        score: 0
      };
    }
  }

  async checkCorsConfiguration(project: JavaProject): Promise<ValidationResult> {
    try {
      const corsConfig = await this.checkCorsSetup(project.path);
      
      if (!corsConfig.found) {
        return {
          status: 'WARNING',
          message: 'CORS no configurado explícitamente',
          score: 50,
          suggestions: [
            'Configurar @CrossOrigin en controllers',
            'Crear CorsConfigurationSource bean',
            'Definir origins permitidos específicamente'
          ]
        };
      }

      if (corsConfig.allowsAll) {
        return {
          status: 'FAILED',
          message: 'CORS permite todos los origins (*)',
          score: 20,
          suggestions: [
            'Especificar origins permitidos explícitamente',
            'Configurar CORS por ambiente',
            'Restringir métodos HTTP permitidos'
          ]
        };
      }

      return {
        status: 'PASSED',
        message: 'CORS configurado correctamente',
        score: 100,
        suggestions: ['Revisar configuración según nuevos requisitos']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar CORS',
        score: 0
      };
    }
  }

  async checkSecureLogging(project: JavaProject): Promise<ValidationResult> {
    try {
      const logIssues = await this.scanForSensitiveLogging(project.path);
      
      if (logIssues.length === 0) {
        return {
          status: 'PASSED',
          message: 'No se detectó logging de información sensible',
          score: 100,
          suggestions: ['Continuar evitando log de passwords/tokens']
        };
      }

      return {
        status: 'WARNING',
        message: `${logIssues.length} posibles logs de información sensible`,
        score: Math.max(40, 100 - (logIssues.length * 15)),
        details: logIssues.slice(0, 3).map(issue => ({
          file: issue.file,
          line: issue.line,
          message: issue.description,
          severity: 'WARNING' as const
        })),
        suggestions: [
          'Evitar loggear passwords y tokens',
          'Usar objetos DTO sin campos sensibles',
          'Configurar logback con filtros'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar logging seguro',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async runMavenDependencyCheck(projectPath: string): Promise<{
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }> {
    // Implementación simplificada - en producción usar OWASP Dependency Check
    return { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
  }

  private async runGradleDependencyCheck(projectPath: string): Promise<{
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }> {
    // Implementación simplificada
    return { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
  }

  private async checkSecurityConfiguration(projectPath: string): Promise<{
    hasConfig: boolean;
    hasEndpointSecurity: boolean;
  }> {
    try {
      const configFiles = await this.findJavaFiles(projectPath, '*Config.java');
      
      for (const configFile of configFiles) {
        const content = await fs.readFile(configFile, 'utf-8');
        
        if (content.includes('@EnableWebSecurity') || content.includes('SecurityFilterChain')) {
          const hasEndpointSecurity = content.includes('authorizeHttpRequests') || 
                                     content.includes('antMatchers');
          
          return {
            hasConfig: true,
            hasEndpointSecurity
          };
        }
      }
      
      return { hasConfig: false, hasEndpointSecurity: false };
    } catch {
      return { hasConfig: false, hasEndpointSecurity: false };
    }
  }

  private async checkValidationUsage(projectPath: string): Promise<{
    totalControllers: number;
    controllersWithValidation: number;
  }> {
    try {
      const controllerFiles = await this.findJavaFiles(projectPath, '*Controller.java');
      let controllersWithValidation = 0;
      
      for (const controllerFile of controllerFiles) {
        const content = await fs.readFile(controllerFile, 'utf-8');
        
        if (content.includes('@Valid') || content.includes('@Validated')) {
          controllersWithValidation++;
        }
      }
      
      return {
        totalControllers: controllerFiles.length,
        controllersWithValidation
      };
    } catch {
      return { totalControllers: 0, controllersWithValidation: 0 };
    }
  }

  private async scanForHardcodedSecrets(projectPath: string): Promise<Array<{
    file: string;
    line: number;
    pattern: string;
  }>> {
    const secretPatterns = [
      /password\s*=\s*"[^"]{3,}"/gi,
      /apikey\s*=\s*"[^"]{10,}"/gi,
      /secret\s*=\s*"[^"]{8,}"/gi,
      /token\s*=\s*"[^"]{20,}"/gi
    ];

    const results: Array<{ file: string; line: number; pattern: string }> = [];
    const javaFiles = await this.findJavaFiles(projectPath);
    
    for (const file of javaFiles.slice(0, 20)) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          secretPatterns.forEach(pattern => {
            const match = pattern.exec(line);
            if (match) {
              results.push({
                file: path.relative(projectPath, file),
                line: index + 1,
                pattern: match[0].substring(0, 30) + '...'
              });
            }
          });
        });
      } catch {
        // Error leyendo archivo
      }
    }
    
    return results;
  }

  private async checkCorsSetup(projectPath: string): Promise<{
    found: boolean;
    allowsAll: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      
      for (const file of javaFiles) {
        const content = await fs.readFile(file, 'utf-8');
        
        if (content.includes('@CrossOrigin') || content.includes('CorsConfiguration')) {
          const allowsAll = content.includes('*') && 
                           (content.includes('allowedOrigins') || content.includes('CrossOrigin'));
          
          return { found: true, allowsAll };
        }
      }
      
      return { found: false, allowsAll: false };
    } catch {
      return { found: false, allowsAll: false };
    }
  }

  private async scanForSensitiveLogging(projectPath: string): Promise<Array<{
    file: string;
    line: number;
    description: string;
  }>> {
    const results: Array<{ file: string; line: number; description: string }> = [];
    const javaFiles = await this.findJavaFiles(projectPath);
    
    for (const file of javaFiles.slice(0, 10)) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('log.') && 
              (line.includes('password') || line.includes('token') || line.includes('secret'))) {
            results.push({
              file: path.relative(projectPath, file),
              line: index + 1,
              description: 'Posible logging de información sensible'
            });
          }
        });
      } catch {
        // Error leyendo archivo
      }
    }
    
    return results;
  }

  private async findJavaFiles(projectPath: string, pattern: string = '*.java'): Promise<string[]> {
    const files: string[] = [];
    const srcPath = path.join(projectPath, 'src', 'main', 'java');
    
    const searchInDirectory = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await searchInDirectory(fullPath);
          } else if (entry.name.endsWith('.java')) {
            if (pattern === '*.java' || entry.name.includes(pattern.replace('*', ''))) {
              files.push(fullPath);
            }
          }
        }
      } catch {
        // Error accediendo directorio
      }
    };

    await searchInDirectory(srcPath);
    return files;
  }
}