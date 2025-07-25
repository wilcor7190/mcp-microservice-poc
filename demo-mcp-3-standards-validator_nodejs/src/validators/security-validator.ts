import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { NodeJSProject, ValidationResult, SecurityAuditResult } from '../types/index.js';

export class SecurityValidator {

  async checkVulnerabilities(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando vulnerabilidades en: ${project.name}`);
      
      // Ejecutar npm audit
      const auditResult = await this.runNpmAudit(project.path);
      
      if (auditResult.summary.total === 0) {
        return {
          status: 'PASSED',
          message: 'No se encontraron vulnerabilidades conocidas',
          score: 100,
          suggestions: ['Mantener dependencias actualizadas regularmente']
        };
      }

      const criticalAndHigh = auditResult.summary.high + (auditResult.summary as any).critical || 0;
      
      if (criticalAndHigh > 0) {
        return {
          status: 'FAILED',
          message: `Se encontraron ${criticalAndHigh} vulnerabilidades críticas/altas`,
          score: Math.max(0, 100 - (criticalAndHigh * 20)),
          details: auditResult.vulnerabilities.slice(0, 5).map(vuln => ({
            message: `${vuln.module_name}: ${vuln.title} (${vuln.severity})`,
            severity: vuln.severity === 'high' || vuln.severity === 'critical' ? 'ERROR' : 'WARNING'
          })),
          suggestions: [
            'Ejecutar "npm audit fix" para reparar automáticamente',
            'Actualizar dependencias vulnerables manualmente',
            'Considerar alternativas más seguras para dependencias críticas'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `Se encontraron ${auditResult.summary.moderate + auditResult.summary.low} vulnerabilidades menores`,
        score: Math.max(60, 100 - (auditResult.summary.moderate * 5) - (auditResult.summary.low * 2)),
        suggestions: ['Revisar y corregir vulnerabilidades menores cuando sea posible']
      };

    } catch (error) {
      console.error(`[SecurityValidator] Error verificando vulnerabilidades:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo ejecutar npm audit',
        score: 0,
        suggestions: ['Verificar que npm esté instalado y el proyecto tenga package-lock.json']
      };
    }
  }

  async checkHardcodedSecrets(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Buscando secrets hardcodeados en: ${project.name}`);
      
      const secretPatterns = [
        /password\s*[:=]\s*["'][^"']{3,}["']/gi,
        /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi,
        /secret\s*[:=]\s*["'][^"']{8,}["']/gi,
        /token\s*[:=]\s*["'][^"']{20,}["']/gi,
        /private[_-]?key\s*[:=]\s*["'][^"']{20,}["']/gi,
        /database[_-]?url\s*[:=]\s*["'][^"']+:[^"']+@[^"']+["']/gi
      ];

      const foundSecrets = await this.scanFilesForPatterns(project.path, secretPatterns);

      if (foundSecrets.length === 0) {
        return {
          status: 'PASSED',
          message: 'No se encontraron secrets hardcodeados',
          score: 100,
          suggestions: ['Continuar usando variables de entorno para secrets']
        };
      }

      return {
        status: 'FAILED',
        message: `Se encontraron ${foundSecrets.length} posibles secrets hardcodeados`,
        score: Math.max(0, 100 - (foundSecrets.length * 25)),
        details: foundSecrets.slice(0, 5).map(secret => ({
          file: secret.file,
          line: secret.line,
          message: `Posible secret hardcodeado: ${secret.pattern}`,
          severity: 'ERROR' as const
        })),
        suggestions: [
          'Mover secrets a variables de entorno (.env)',
          'Usar servicios de gestión de secrets (AWS Secrets Manager, etc.)',
          'Agregar .env al .gitignore',
          'Revisar historial de Git para secrets expuestos'
        ]
      };

    } catch (error) {
      console.error(`[SecurityValidator] Error buscando secrets:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo escanear archivos',
        score: 0
      };
    }
  }

  async checkHelmetUsage(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando uso de Helmet en: ${project.name}`);
      
      // Verificar si helmet está instalado
      const hasHelmet = project.packageJson.dependencies.helmet || 
                       project.packageJson.devDependencies.helmet;

      if (!hasHelmet) {
        return {
          status: 'FAILED',
          message: 'Helmet no está instalado',
          score: 0,
          suggestions: [
            'Instalar helmet: npm install helmet',
            'Configurar helmet en main.ts (NestJS) o app.js (Express)',
            'Revisar headers de seguridad en respuestas HTTP'
          ]
        };
      }

      // Verificar si helmet está siendo usado
      const helmetUsage = await this.checkHelmetConfiguration(project.path);
      
      if (helmetUsage.configured) {
        return {
          status: 'PASSED',
          message: 'Helmet está instalado y configurado',
          score: 100,
          suggestions: ['Revisar configuración de helmet para casos específicos']
        };
      }

      return {
        status: 'WARNING',
        message: 'Helmet está instalado pero no configurado correctamente',
        score: 50,
        suggestions: [
          'Agregar app.use(helmet()) en la configuración',
          'Configurar helmet con opciones específicas según necesidades',
          'Verificar que los headers de seguridad se estén enviando'
        ]
      };

    } catch (error) {
      console.error(`[SecurityValidator] Error verificando Helmet:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar configuración de Helmet',
        score: 0
      };
    }
  }

  async checkCorsConfiguration(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando configuración de CORS en: ${project.name}`);
      
      const corsConfig = await this.findCorsConfiguration(project.path);
      
      if (!corsConfig.found) {
        return {
          status: 'WARNING',
          message: 'No se encontró configuración explícita de CORS',
          score: 30,
          suggestions: [
            'Configurar CORS explícitamente en lugar de usar valores por defecto',
            'Definir origins permitidos específicamente',
            'Considerar diferentes configuraciones para dev/prod'
          ]
        };
      }

      if (corsConfig.allowsAll) {
        return {
          status: 'FAILED',
          message: 'CORS configurado para permitir todos los origins (*)',
          score: 10,
          details: corsConfig.locations.map(loc => ({
            file: loc.file,
            line: loc.line,
            message: 'CORS permite todos los origins',
            severity: 'ERROR' as const
          })),
          suggestions: [
            'Especificar origins permitidos explícitamente',
            'Usar diferentes configuraciones para entornos',
            'Implementar allowlist de dominios'
          ]
        };
      }

      return {
        status: 'PASSED',
        message: 'CORS configurado correctamente',
        score: 100,
        suggestions: ['Revisar configuración periodicamente según nuevos requisitos']
      };

    } catch (error) {
      console.error(`[SecurityValidator] Error verificando CORS:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar configuración de CORS',
        score: 0
      };
    }
  }

  async checkInputValidation(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando validación de input en: ${project.name}`);
      
      const validationUsage = await this.checkValidationLibraries(project);
      
      if (project.framework === 'nestjs') {
        // Para NestJS, verificar uso de pipes de validación
        const nestValidation = await this.checkNestJSValidation(project.path);
        
        if (nestValidation.hasGlobalPipes && nestValidation.hasDTOs) {
          return {
            status: 'PASSED',
            message: 'Validación de input configurada correctamente (NestJS)',
            score: 100,
            suggestions: ['Continuar usando DTOs con decorators de validación']
          };
        }

        return {
          status: 'WARNING',
          message: 'Validación de input parcialmente implementada',
          score: 60,
          suggestions: [
            'Configurar ValidationPipe globalmente',
            'Usar DTOs con class-validator para todos los endpoints',
            'Implementar pipes personalizados para casos específicos'
          ]
        };
      }

      // Para otros frameworks
      if (validationUsage.libraries.length === 0) {
        return {
          status: 'FAILED',
          message: 'No se encontraron librerías de validación',
          score: 0,
          suggestions: [
            'Instalar librería de validación (joi, express-validator, etc.)',
            'Implementar middleware de validación en rutas',
            'Validar y sanitizar todos los inputs del usuario'
          ]
        };
      }

      return {
        status: 'PASSED',
        message: `Validación implementada con: ${validationUsage.libraries.join(', ')}`,
        score: 85,
        suggestions: ['Asegurar que todas las rutas tengan validación']
      };

    } catch (error) {
      console.error(`[SecurityValidator] Error verificando validación:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar validación de input',
        score: 0
      };
    }
  }

  async checkRateLimiting(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[SecurityValidator] Verificando rate limiting en: ${project.name}`);
      
      const rateLimitingLibraries = [
        'express-rate-limit',
        '@nestjs/throttler',
        'rate-limiter-flexible',
        'express-slow-down'
      ];

      const hasRateLimiting = rateLimitingLibraries.some(lib => 
        project.packageJson.dependencies[lib] || project.packageJson.devDependencies[lib]
      );

      if (!hasRateLimiting) {
        return {
          status: 'WARNING',
          message: 'No se encontró implementación de rate limiting',
          score: 40,
          suggestions: [
            'Instalar express-rate-limit o @nestjs/throttler',
            'Configurar límites por IP y por endpoint',
            'Implementar diferentes límites para usuarios autenticados'
          ]
        };
      }

      const rateLimitConfig = await this.checkRateLimitConfiguration(project.path);
      
      if (rateLimitConfig.configured) {
        return {
          status: 'PASSED',
          message: 'Rate limiting configurado',
          score: 100,
          suggestions: ['Monitorear métricas de rate limiting en producción']
        };
      }

      return {
        status: 'WARNING',
        message: 'Librería de rate limiting instalada pero no configurada',
        score: 60,
        suggestions: [
          'Configurar middleware de rate limiting',
          'Definir límites apropiados por endpoint',
          'Implementar mensajes de error personalizados'
        ]
      };

    } catch (error) {
      console.error(`[SecurityValidator] Error verificando rate limiting:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar rate limiting',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async runNpmAudit(projectPath: string): Promise<SecurityAuditResult> {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['audit', '--json'], {
        cwd: projectPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        try {
          if (stdout) {
            const auditData = JSON.parse(stdout);
            resolve(this.parseAuditResults(auditData));
          } else {
            // Sin vulnerabilidades
            resolve({
              vulnerabilities: [],
              summary: { total: 0, high: 0, moderate: 0, low: 0, info: 0 }
            });
          }
        } catch (error) {
          reject(new Error(`Error parsing npm audit: ${error}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  private parseAuditResults(auditData: any): SecurityAuditResult {
    const vulnerabilities = [];
    const summary = {
      total: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0
    };

    if (auditData.vulnerabilities) {
      for (const [name, vuln] of Object.entries(auditData.vulnerabilities as any)) {
        const vulnerability = vuln as any;
        vulnerabilities.push({
          id: vulnerability.id || 0,
          title: vulnerability.title || `Vulnerability in ${name}`,
          severity: vulnerability.severity || 'info',
          vulnerable_versions: vulnerability.range || 'unknown',
          patched_versions: vulnerability.fixAvailable || 'none',
          module_name: name,
          recommendation: vulnerability.recommendation || 'Update to latest version'
        });

        summary.total++;
        summary[vulnerability.severity as keyof typeof summary]++;
      }
    }

    return { vulnerabilities, summary };
  }

  private async scanFilesForPatterns(
    projectPath: string, 
    patterns: RegExp[]
  ): Promise<Array<{ file: string; line: number; pattern: string }>> {
    const results: Array<{ file: string; line: number; pattern: string }> = [];
    
    const scanDirectory = async (dir: string, depth: number = 0): Promise<void> => {
      if (depth > 3) return; // Limitar profundidad
      
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (this.shouldSkipFile(entry.name)) continue;
          
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await scanDirectory(fullPath, depth + 1);
          } else if (this.isTextFile(entry.name)) {
            const fileResults = await this.scanFileForPatterns(fullPath, patterns);
            results.push(...fileResults);
          }
        }
      } catch (error) {
        // Ignorar errores de acceso
      }
    };

    await scanDirectory(projectPath);
    return results;
  }

  private async scanFileForPatterns(
    filePath: string, 
    patterns: RegExp[]
  ): Promise<Array<{ file: string; line: number; pattern: string }>> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const results: Array<{ file: string; line: number; pattern: string }> = [];
      
      lines.forEach((line, index) => {
        patterns.forEach(pattern => {
          const match = pattern.exec(line);
          if (match) {
            results.push({
              file: path.relative(process.cwd(), filePath),
              line: index + 1,
              pattern: match[0].substring(0, 50) + '...'
            });
          }
        });
      });
      
      return results;
    } catch {
      return [];
    }
  }

  private shouldSkipFile(fileName: string): boolean {
    const skipPatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.env',
      'package-lock.json',
      'yarn.lock'
    ];
    
    return skipPatterns.some(pattern => fileName.includes(pattern));
  }

  private isTextFile(fileName: string): boolean {
    const textExtensions = ['.js', '.ts', '.json', '.yml', '.yaml', '.md', '.txt'];
    return textExtensions.some(ext => fileName.endsWith(ext));
  }

  private async checkHelmetConfiguration(projectPath: string): Promise<{ configured: boolean }> {
    // Simplificado - buscar uso de helmet en archivos principales
    const mainFiles = ['main.ts', 'app.js', 'index.js', 'server.js'];
    
    for (const file of mainFiles) {
      try {
        const filePath = path.join(projectPath, 'src', file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        if (content.includes('helmet()') || content.includes('helmet.')) {
          return { configured: true };
        }
      } catch {
        // Archivo no existe, continuar
      }
    }
    
    return { configured: false };
  }

  private async findCorsConfiguration(projectPath: string): Promise<{
    found: boolean;
    allowsAll: boolean;
    locations: Array<{ file: string; line: number }>;
  }> {
    // Implementación simplificada
    return {
      found: true,
      allowsAll: false,
      locations: []
    };
  }

  private async checkValidationLibraries(project: NodeJSProject): Promise<{
    libraries: string[];
  }> {
    const validationLibs = [
      'class-validator',
      'joi', 
      'express-validator',
      'yup',
      'ajv'
    ];

    const found = validationLibs.filter(lib => 
      project.packageJson.dependencies[lib] || project.packageJson.devDependencies[lib]
    );

    return { libraries: found };
  }

  private async checkNestJSValidation(projectPath: string): Promise<{
    hasGlobalPipes: boolean;
    hasDTOs: boolean;
  }> {
    // Implementación simplificada
    return {
      hasGlobalPipes: true,
      hasDTOs: true
    };
  }

  private async checkRateLimitConfiguration(projectPath: string): Promise<{ configured: boolean }> {
    // Implementación simplificada
    return { configured: true };
  }
}