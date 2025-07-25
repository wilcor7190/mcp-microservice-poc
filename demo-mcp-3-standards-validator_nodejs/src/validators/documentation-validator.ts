import { promises as fs } from 'fs';
import path from 'path';
import { NodeJSProject, ValidationResult } from '../types/index.js';

export class DocumentationValidator {

  async checkReadmeCompleteness(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const readmePath = path.join(project.path, 'README.md');
      const readmeContent = await fs.readFile(readmePath, 'utf-8');
      
      const requiredSections = [
        { name: 'Título', pattern: /^#\s+.+/m },
        { name: 'Descripción', pattern: /descripci[oó]n|description/i },
        { name: 'Instalación', pattern: /instalaci[oó]n|installation|npm install/i },
        { name: 'Uso', pattern: /uso|usage|getting started/i },
        { name: 'Scripts', pattern: /scripts|comandos|commands/i },
        { name: 'API/Endpoints', pattern: /api|endpoints|routes/i }
      ];

      const foundSections = requiredSections.filter(section => 
        section.pattern.test(readmeContent)
      );

      const completeness = (foundSections.length / requiredSections.length) * 100;

      if (completeness >= 80) {
        return {
          status: 'PASSED',
          message: `README completo (${foundSections.length}/${requiredSections.length} secciones)`,
          score: 100,
          suggestions: ['Mantener README actualizado con cambios del proyecto']
        };
      }

      const missingSections = requiredSections
        .filter(section => !section.pattern.test(readmeContent))
        .map(section => section.name);

      return {
        status: completeness >= 50 ? 'WARNING' : 'FAILED',
        message: `README incompleto - faltan: ${missingSections.join(', ')}`,
        score: Math.max(20, completeness),
        suggestions: [
          'Agregar secciones faltantes al README',
          'Incluir ejemplos de uso',
          'Documentar variables de entorno'
        ]
      };

    } catch (error) {
      return {
        status: 'FAILED',
        message: 'README.md no encontrado',
        score: 0,
        suggestions: [
          'Crear README.md en la raíz del proyecto',
          'Incluir descripción, instalación y uso',
          'Documentar API endpoints si aplica'
        ]
      };
    }
  }

  async checkSwaggerDocumentation(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const hasSwagger = project.packageJson.dependencies['@nestjs/swagger'] ||
                        project.packageJson.devDependencies['@nestjs/swagger'] ||
                        project.packageJson.dependencies['swagger-ui-express'] ||
                        project.packageJson.devDependencies['swagger-ui-express'];

      if (!hasSwagger) {
        return {
          status: 'FAILED',
          message: 'Swagger/OpenAPI no está configurado',
          score: 0,
          suggestions: [
            'Instalar @nestjs/swagger para NestJS',
            'Instalar swagger-ui-express para Express',
            'Configurar documentación automática de API'
          ]
        };
      }

      const swaggerConfig = await this.checkSwaggerSetup(project.path);
      
      if (swaggerConfig.configured) {
        return {
          status: 'PASSED',
          message: 'Swagger/OpenAPI configurado',
          score: 100,
          suggestions: [
            'Agregar decorators @ApiOperation y @ApiResponse',
            'Documentar DTOs con @ApiProperty',
            'Incluir ejemplos en la documentación'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: 'Swagger instalado pero no configurado',
        score: 40,
        suggestions: [
          'Configurar SwaggerModule en main.ts',
          'Agregar SwaggerModule.setup()',
          'Definir configuración DocumentBuilder'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar Swagger',
        score: 0
      };
    }
  }

  async checkJSDocCoverage(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const coverage = await this.analyzeJSDocCoverage(project.path);
      
      if (coverage.percentage >= 80) {
        return {
          status: 'PASSED',
          message: `JSDoc cobertura: ${coverage.percentage.toFixed(1)}%`,
          score: 100,
          suggestions: ['Mantener documentación actualizada']
        };
      }

      if (coverage.percentage >= 50) {
        return {
          status: 'WARNING',
          message: `JSDoc cobertura baja: ${coverage.percentage.toFixed(1)}%`,
          score: 60,
          suggestions: [
            'Documentar funciones públicas principales',
            'Agregar @param y @returns a funciones complejas',
            'Documentar interfaces y tipos importantes'
          ]
        };
      }

      return {
        status: 'FAILED',
        message: `JSDoc cobertura muy baja: ${coverage.percentage.toFixed(1)}%`,
        score: Math.max(10, coverage.percentage),
        suggestions: [
          'Comenzar documentando funciones públicas',
          'Usar JSDoc para APIs y funciones complejas',
          'Considerar herramientas como TypeDoc'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar JSDoc',
        score: 0
      };
    }
  }

  async checkChangelogExists(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const changelogPath = path.join(project.path, 'CHANGELOG.md');
      await fs.access(changelogPath);
      
      const content = await fs.readFile(changelogPath, 'utf-8');
      const hasEntries = content.length > 100 && /##?\s*\[?\d+\.\d+\.\d+\]?/.test(content);
      
      return {
        status: hasEntries ? 'PASSED' : 'WARNING',
        message: hasEntries ? 'CHANGELOG.md presente y con contenido' : 'CHANGELOG.md existe pero vacío',
        score: hasEntries ? 100 : 70,
        suggestions: hasEntries ? 
          ['Mantener changelog actualizado con cada release'] :
          ['Agregar entradas al changelog con cambios significativos']
      };

    } catch (error) {
      return {
        status: 'INFO',
        message: 'CHANGELOG.md no encontrado',
        score: 80, // No crítico pero recomendado
        suggestions: [
          'Crear CHANGELOG.md para documentar cambios',
          'Usar formato Keep a Changelog',
          'Automatizar con conventional commits'
        ]
      };
    }
  }

  async checkDeploymentDocs(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const deploymentFiles = [
        'Dockerfile',
        'docker-compose.yml',
        'k8s',
        'kubernetes',
        'deploy',
        'deployment'
      ];

      const foundFiles = [];
      const foundDocs = [];

      for (const file of deploymentFiles) {
        const filePath = path.join(project.path, file);
        try {
          const stat = await fs.stat(filePath);
          foundFiles.push(file);
          
          // Buscar documentación relacionada
          if (stat.isDirectory()) {
            const readmePath = path.join(filePath, 'README.md');
            try {
              await fs.access(readmePath);
              foundDocs.push(`${file}/README.md`);
            } catch {}
          }
        } catch {}
      }

      if (foundFiles.length === 0) {
        return {
          status: 'WARNING',
          message: 'No se encontraron archivos de deployment',
          score: 50,
          suggestions: [
            'Crear Dockerfile para containerización',
            'Agregar docker-compose.yml para desarrollo',
            'Documentar proceso de deployment'
          ]
        };
      }

      const hasDocumentation = foundDocs.length > 0 || 
                             await this.checkDeploymentInReadme(project.path);

      return {
        status: hasDocumentation ? 'PASSED' : 'WARNING',
        message: `Deployment files: ${foundFiles.join(', ')}${hasDocumentation ? ' (documentado)' : ' (sin documentar)'}`,
        score: hasDocumentation ? 100 : 70,
        suggestions: hasDocumentation ? 
          ['Mantener documentación de deployment actualizada'] :
          ['Documentar proceso de deployment', 'Incluir instrucciones de Docker/K8s']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar documentación de deployment',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async checkSwaggerSetup(projectPath: string): Promise<{ configured: boolean }> {
    try {
      const mainFiles = ['main.ts', 'app.js', 'index.js'];
      
      for (const file of mainFiles) {
        const filePath = path.join(projectPath, 'src', file);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          
          if (content.includes('SwaggerModule') || content.includes('swagger-ui-express')) {
            return { configured: true };
          }
        } catch {
          continue;
        }
      }
      
      return { configured: false };
    } catch {
      return { configured: false };
    }
  }

  private async analyzeJSDocCoverage(projectPath: string): Promise<{ 
    percentage: number;
    totalFunctions: number;
    documentedFunctions: number;
  }> {
    try {
      const srcPath = path.join(projectPath, 'src');
      const tsFiles = await this.getTSFiles(srcPath);
      
      let totalFunctions = 0;
      let documentedFunctions = 0;

      for (const file of tsFiles.slice(0, 20)) { // Analizar máximo 20 archivos
        const content = await fs.readFile(file, 'utf-8');
        
        // Buscar funciones/métodos (simplificado)
        const functionMatches = content.match(/^\s*(export\s+)?(async\s+)?function\s+\w+|^\s*(public|private|protected)?\s*(async\s+)?\w+\s*\(/gm);
        
        if (functionMatches) {
          totalFunctions += functionMatches.length;
          
          // Contar funciones documentadas (simplificado)
          const docMatches = content.match(/\/\*\*[\s\S]*?\*\/\s*(export\s+)?(async\s+)?function|\*\/\s*(public|private|protected)?\s*(async\s+)?\w+\s*\(/g);
          
          if (docMatches) {
            documentedFunctions += Math.min(docMatches.length, functionMatches.length);
          }
        }
      }

      const percentage = totalFunctions > 0 ? (documentedFunctions / totalFunctions) * 100 : 0;
      
      return {
        percentage,
        totalFunctions,
        documentedFunctions
      };
    } catch {
      return { percentage: 0, totalFunctions: 0, documentedFunctions: 0 };
    }
  }

  private async getTSFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.getTSFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.name.endsWith('.ts') && !entry.name.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    } catch {
      // Error accediendo directorio
    }
    
    return files;
  }

  private async checkDeploymentInReadme(projectPath: string): Promise<boolean> {
    try {
      const readmePath = path.join(projectPath, 'README.md');
      const content = await fs.readFile(readmePath, 'utf-8');
      
      const deploymentKeywords = [
        'docker',
        'deployment',
        'deploy',
        'kubernetes',
        'k8s',
        'container'
      ];

      return deploymentKeywords.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
    } catch {
      return false;
    }
  }
}