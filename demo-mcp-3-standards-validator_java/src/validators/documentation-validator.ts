import { promises as fs } from 'fs';
import path from 'path';
import { JavaProject, ValidationResult } from '../types/index.js';

export class DocumentationValidator {

  async checkReadmeCompleteness(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[DocumentationValidator] Verificando README completo: ${project.name}`);
      
      const readmePath = await this.findReadmeFile(project.path);
      
      if (!readmePath) {
        return {
          status: 'FAILED',
          message: 'README.md no encontrado',
          score: 0,
          suggestions: [
            'Crear README.md con descripción del proyecto',
            'Incluir instrucciones de instalación y uso',
            'Agregar ejemplos de configuración'
          ]
        };
      }

      const content = await fs.readFile(readmePath, 'utf-8');
      const sections = await this.analyzeReadmeSections(content);
      
      const requiredSections = [
        'title', 'description', 'installation', 'usage', 'configuration'
      ];
      
      const foundSections = requiredSections.filter(section => sections[section]);
      const completeness = (foundSections.length / requiredSections.length) * 100;

      if (completeness >= 80) {
        return {
          status: 'PASSED',
          message: `README completo (${foundSections.length}/${requiredSections.length} secciones)`,
          score: 100,
          suggestions: ['Mantener README actualizado con cambios del proyecto']
        };
      }

      const missingSections = requiredSections.filter(section => !sections[section]);

      return {
        status: 'WARNING',
        message: `README incompleto (${foundSections.length}/${requiredSections.length} secciones)`,
        score: Math.max(40, completeness),
        suggestions: [
          `Agregar secciones faltantes: ${missingSections.join(', ')}`,
          'Incluir ejemplos de requests/responses',
          'Documentar variables de entorno'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar README',
        score: 0
      };
    }
  }

  async checkSwaggerDocumentation(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[DocumentationValidator] Verificando documentación Swagger: ${project.name}`);
      
      const hasSwagger = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'springdoc-openapi-ui' ||
        dep.artifactId === 'springfox-swagger2' ||
        dep.artifactId === 'springdoc-openapi-starter-webmvc-ui'
      );

      if (!hasSwagger) {
        return {
          status: 'FAILED',
          message: 'SpringDoc OpenAPI no configurado',
          score: 20,
          suggestions: [
            'Agregar springdoc-openapi-starter-webmvc-ui',
            'Configurar @OpenAPIDefinition en main class',
            'Documentar endpoints con @Operation'
          ]
        };
      }

      const swaggerUsage = await this.analyzeSwaggerUsage(project.path);
      
      if (swaggerUsage.controllersWithDocs >= swaggerUsage.totalControllers * 0.8) {
        return {
          status: 'PASSED',
          message: `${swaggerUsage.controllersWithDocs}/${swaggerUsage.totalControllers} controllers documentados`,
          score: 100,
          suggestions: [
            'Continuar documentando nuevos endpoints',
            'Usar @Schema para documentar DTOs'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `${swaggerUsage.controllersWithDocs}/${swaggerUsage.totalControllers} controllers documentados`,
        score: Math.max(50, (swaggerUsage.controllersWithDocs / swaggerUsage.totalControllers) * 100),
        suggestions: [
          'Agregar @Operation a métodos de controller',
          'Documentar parámetros con @Parameter',
          'Usar @ApiResponse para responses'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar documentación Swagger',
        score: 0
      };
    }
  }

  async checkJavaDocCoverage(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[DocumentationValidator] Verificando cobertura JavaDoc: ${project.name}`);
      
      const javadocCoverage = await this.analyzeJavaDocCoverage(project.path);
      
      if (javadocCoverage.coveragePercentage >= 70) {
        return {
          status: 'PASSED',
          message: `JavaDoc: ${javadocCoverage.coveragePercentage.toFixed(1)}% de cobertura`,
          score: 100,
          suggestions: ['Continuar documentando métodos públicos']
        };
      }

      if (javadocCoverage.coveragePercentage >= 40) {
        return {
          status: 'WARNING',
          message: `JavaDoc: ${javadocCoverage.coveragePercentage.toFixed(1)}% de cobertura`,
          score: Math.max(60, javadocCoverage.coveragePercentage),
          suggestions: [
            'Documentar métodos públicos con JavaDoc',
            'Agregar @param y @return descriptions',
            'Documentar clases principales'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `JavaDoc: ${javadocCoverage.coveragePercentage.toFixed(1)}% de cobertura (bajo)`,
        score: Math.max(30, javadocCoverage.coveragePercentage),
        details: javadocCoverage.undocumentedMethods.slice(0, 5).map(method => ({
          file: method.file,
          line: method.line,
          message: `Método sin documentar: ${method.name}`,
          severity: 'WARNING' as const
        })),
        suggestions: [
          'Agregar JavaDoc a métodos públicos',
          'Documentar parámetros y valores de retorno',
          'Incluir ejemplos de uso en documentation'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar JavaDoc',
        score: 0
      };
    }
  }

  async checkConfigurationDocs(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[DocumentationValidator] Verificando documentación de configuración: ${project.name}`);
      
      const configAnalysis = await this.analyzeConfigurationDocs(project.path);
      
      if (configAnalysis.hasApplicationProperties && configAnalysis.hasConfigDoc) {
        return {
          status: 'PASSED',
          message: 'Configuración bien documentada',
          score: 100,
          suggestions: ['Mantener documentación actualizada con nuevas propiedades']
        };
      }

      if (!configAnalysis.hasApplicationProperties) {
        return {
          status: 'WARNING',
          message: 'application.properties/yml no encontrado',
          score: 40,
          suggestions: [
            'Crear application.properties con configuración básica',
            'Documentar propiedades importantes',
            'Usar profiles para diferentes entornos'
          ]
        };
      }

      if (!configAnalysis.hasConfigDoc) {
        return {
          status: 'WARNING',
          message: 'Configuración sin documentar',
          score: 60,
          suggestions: [
            'Documentar propiedades de configuración',
            'Crear application-example.properties',
            'Incluir valores por defecto y ejemplos'
          ]
        };
      }

      return {
        status: 'INFO',
        message: 'Configuración básica presente',
        score: 70,
        suggestions: ['Mejorar documentación de propiedades']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar documentación de configuración',
        score: 0
      };
    }
  }

  async checkDockerDocumentation(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[DocumentationValidator] Verificando documentación Docker: ${project.name}`);
      
      const dockerAnalysis = await this.analyzeDockerSetup(project.path);
      
      if (dockerAnalysis.hasDockerfile && dockerAnalysis.hasDockerCompose && dockerAnalysis.hasDockerDocs) {
        return {
          status: 'PASSED',
          message: 'Documentación Docker completa',
          score: 100,
          suggestions: ['Mantener Dockerfile y docker-compose actualizados']
        };
      }

      let score = 60; // Base score
      const suggestions: string[] = [];

      if (!dockerAnalysis.hasDockerfile) {
        suggestions.push('Crear Dockerfile para containerización');
      } else {
        score += 15;
      }

      if (!dockerAnalysis.hasDockerCompose) {
        suggestions.push('Agregar docker-compose.yml para desarrollo');
      } else {
        score += 15;
      }

      if (!dockerAnalysis.hasDockerDocs) {
        suggestions.push('Documentar comandos Docker en README');
      } else {
        score += 10;
      }

      const foundItems = [dockerAnalysis.hasDockerfile, dockerAnalysis.hasDockerCompose, dockerAnalysis.hasDockerDocs].filter(Boolean).length;

      return {
        status: foundItems > 0 ? 'INFO' : 'INFO',
        message: `${foundItems}/3 elementos Docker encontrados`,
        score,
        suggestions
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar documentación Docker',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async findReadmeFile(projectPath: string): Promise<string | null> {
    const possibleNames = ['README.md', 'readme.md', 'README.txt', 'README'];
    
    for (const name of possibleNames) {
      const filePath = path.join(projectPath, name);
      try {
        await fs.access(filePath);
        return filePath;
      } catch {
        // Archivo no existe
      }
    }
    
    return null;
  }

  private async analyzeReadmeSections(content: string): Promise<Record<string, boolean>> {
    const lowerContent = content.toLowerCase();
    
    return {
      title: content.includes('#') || content.includes('# '),
      description: lowerContent.includes('description') || lowerContent.includes('about'),
      installation: lowerContent.includes('install') || lowerContent.includes('setup'),
      usage: lowerContent.includes('usage') || lowerContent.includes('how to') || lowerContent.includes('getting started'),
      configuration: lowerContent.includes('config') || lowerContent.includes('environment'),
      api: lowerContent.includes('api') || lowerContent.includes('endpoint'),
      contributing: lowerContent.includes('contribut'),
      license: lowerContent.includes('license')
    };
  }

  private async analyzeSwaggerUsage(projectPath: string): Promise<{
    totalControllers: number;
    controllersWithDocs: number;
  }> {
    try {
      const controllerFiles = await this.findJavaFiles(projectPath, '*Controller.java');
      let controllersWithDocs = 0;
      
      for (const controllerFile of controllerFiles) {
        try {
          const content = await fs.readFile(controllerFile, 'utf-8');
          
          if (content.includes('@Operation') || content.includes('@ApiOperation') ||
              content.includes('@Parameter') || content.includes('@Schema')) {
            controllersWithDocs++;
          }
        } catch {
          // Error leyendo archivo
        }
      }
      
      return {
        totalControllers: controllerFiles.length,
        controllersWithDocs
      };
    } catch {
      return { totalControllers: 0, controllersWithDocs: 0 };
    }
  }

  private async analyzeJavaDocCoverage(projectPath: string): Promise<{
    coveragePercentage: number;
    undocumentedMethods: Array<{ file: string; line: number; name: string }>;
  }> {
    const undocumentedMethods: Array<{ file: string; line: number; name: string }> = [];
    const javaFiles = await this.findJavaFiles(projectPath);
    let totalMethods = 0;
    let documentedMethods = 0;
    
    for (const file of javaFiles.slice(0, 20)) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const methodMatch = line.match(/public\s+\w+\s+(\w+)\s*\(/);
          
          if (methodMatch && !line.includes('main(')) {
            totalMethods++;
            const methodName = methodMatch[1];
            
            // Buscar JavaDoc arriba del método
            let hasJavaDoc = false;
            for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
              if (lines[j].trim().includes('/**') || lines[j].trim().includes('*/')) {
                hasJavaDoc = true;
                break;
              }
            }
            
            if (hasJavaDoc) {
              documentedMethods++;
            } else {
              undocumentedMethods.push({
                file: path.relative(projectPath, file),
                line: i + 1,
                name: methodName
              });
            }
          }
        }
      } catch {
        // Error leyendo archivo
      }
    }
    
    const coveragePercentage = totalMethods > 0 ? (documentedMethods / totalMethods) * 100 : 0;
    
    return {
      coveragePercentage,
      undocumentedMethods
    };
  }

  private async analyzeConfigurationDocs(projectPath: string): Promise<{
    hasApplicationProperties: boolean;
    hasConfigDoc: boolean;
  }> {
    try {
      const resourcesPath = path.join(projectPath, 'src', 'main', 'resources');
      
      // Verificar application.properties/yml
      const configFiles = ['application.properties', 'application.yml', 'application.yaml'];
      let hasApplicationProperties = false;
      
      for (const configFile of configFiles) {
        try {
          await fs.access(path.join(resourcesPath, configFile));
          hasApplicationProperties = true;
          break;
        } catch {
          // Archivo no existe
        }
      }
      
      // Verificar documentación de configuración
      const readmePath = await this.findReadmeFile(projectPath);
      let hasConfigDoc = false;
      
      if (readmePath) {
        const readmeContent = await fs.readFile(readmePath, 'utf-8');
        hasConfigDoc = readmeContent.toLowerCase().includes('config') ||
                      readmeContent.toLowerCase().includes('environment') ||
                      readmeContent.toLowerCase().includes('properties');
      }
      
      return {
        hasApplicationProperties,
        hasConfigDoc
      };
    } catch {
      return { hasApplicationProperties: false, hasConfigDoc: false };
    }
  }

  private async analyzeDockerSetup(projectPath: string): Promise<{
    hasDockerfile: boolean;
    hasDockerCompose: boolean;
    hasDockerDocs: boolean;
  }> {
    try {
      // Verificar Dockerfile
      let hasDockerfile = false;
      try {
        await fs.access(path.join(projectPath, 'Dockerfile'));
        hasDockerfile = true;
      } catch {
        // Dockerfile no existe
      }
      
      // Verificar docker-compose
      let hasDockerCompose = false;
      const composeFiles = ['docker-compose.yml', 'docker-compose.yaml', 'compose.yml'];
      for (const composeFile of composeFiles) {
        try {
          await fs.access(path.join(projectPath, composeFile));
          hasDockerCompose = true;
          break;
        } catch {
          // Archivo no existe
        }
      }
      
      // Verificar documentación Docker
      let hasDockerDocs = false;
      const readmePath = await this.findReadmeFile(projectPath);
      if (readmePath) {
        const readmeContent = await fs.readFile(readmePath, 'utf-8');
        hasDockerDocs = readmeContent.toLowerCase().includes('docker') ||
                       readmeContent.toLowerCase().includes('container');
      }
      
      return {
        hasDockerfile,
        hasDockerCompose,
        hasDockerDocs
      };
    } catch {
      return { hasDockerfile: false, hasDockerCompose: false, hasDockerDocs: false };
    }
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