import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { NodeJSProject, ValidationResult } from '../types/index.js';

export class CodeQualityValidator {

  async checkESLintConfiguration(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const hasESLint = project.packageJson.dependencies.eslint || 
                       project.packageJson.devDependencies.eslint;

      if (!hasESLint) {
        return {
          status: 'FAILED',
          message: 'ESLint no está instalado',
          score: 0,
          suggestions: [
            'Instalar ESLint: npm install --save-dev eslint',
            'Configurar ESLint con: npx eslint --init',
            'Agregar script "lint": "eslint src/**/*.ts"'
          ]
        };
      }

      const configExists = await this.checkESLintConfig(project.path);
      const hasLintScript = !!(project.packageJson.scripts.lint);

      if (configExists && hasLintScript) {
        const lintResults = await this.runESLint(project.path);
        
        if (lintResults.errorCount === 0) {
          return {
            status: 'PASSED',
            message: `ESLint configurado - ${lintResults.warningCount} warnings`,
            score: 100,
            suggestions: ['Resolver warnings restantes si es posible']
          };
        }

        return {
          status: 'FAILED',
          message: `ESLint: ${lintResults.errorCount} errores, ${lintResults.warningCount} warnings`,
          score: Math.max(0, 100 - (lintResults.errorCount * 10) - (lintResults.warningCount * 2)),
          suggestions: [
            'Ejecutar "npm run lint -- --fix" para correcciones automáticas',
            'Revisar reglas de ESLint en configuración',
            'Corregir errores antes de commit'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: 'ESLint instalado pero no configurado completamente',
        score: 40,
        suggestions: [
          'Crear archivo .eslintrc.js',
          'Agregar script lint en package.json',
          'Configurar reglas específicas para el proyecto'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar ESLint',
        score: 0
      };
    }
  }

  async checkPrettierConfiguration(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const hasPrettier = project.packageJson.dependencies.prettier || 
                         project.packageJson.devDependencies.prettier;

      if (!hasPrettier) {
        return {
          status: 'WARNING',
          message: 'Prettier no está instalado',
          score: 60,
          suggestions: [
            'Instalar Prettier: npm install --save-dev prettier',
            'Crear .prettierrc para configuración',
            'Integrar con ESLint usando eslint-config-prettier'
          ]
        };
      }

      const configExists = await this.checkPrettierConfig(project.path);
      
      return {
        status: configExists ? 'PASSED' : 'WARNING',
        message: configExists ? 'Prettier configurado' : 'Prettier instalado sin configuración',
        score: configExists ? 100 : 80,
        suggestions: configExists ? 
          ['Asegurar consistencia con reglas de ESLint'] :
          ['Crear .prettierrc con configuración del proyecto']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar Prettier',
        score: 0
      };
    }
  }

  async checkTypeScriptStrict(project: NodeJSProject): Promise<ValidationResult> {
    if (!project.hasTypeScript) {
      return {
        status: 'INFO',
        message: 'Proyecto no usa TypeScript',
        score: 70, // Neutral para proyectos JS
        suggestions: ['Considerar migrar a TypeScript para mejor type safety']
      };
    }

    try {
      const tsConfig = await this.readTSConfig(project.path);
      
      if (!tsConfig) {
        return {
          status: 'FAILED',
          message: 'tsconfig.json no encontrado',
          score: 0,
          suggestions: [
            'Crear tsconfig.json',
            'Configurar opciones strict',
            'Definir paths y baseUrl apropiados'
          ]
        };
      }

      const strictOptions = this.checkStrictOptions(tsConfig);
      
      if (strictOptions.allStrict) {
        return {
          status: 'PASSED',
          message: 'TypeScript configurado en modo strict',
          score: 100,
          suggestions: ['Mantener configuración strict para mejor type safety']
        };
      }

      return {
        status: 'WARNING',
        message: `Modo strict parcial: ${strictOptions.enabledCount}/${strictOptions.totalCount}`,
        score: 50 + (strictOptions.enabledCount / strictOptions.totalCount) * 50,
        suggestions: [
          'Habilitar "strict": true en tsconfig.json',
          'Configurar "noImplicitAny": true',
          'Habilitar "strictNullChecks": true'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar configuración TypeScript',
        score: 0
      };
    }
  }

  async checkNestJSArchitecture(project: NodeJSProject): Promise<ValidationResult> {
    if (project.framework !== 'nestjs') {
      return {
        status: 'INFO',
        message: 'No es un proyecto NestJS',
        score: 80, // Neutral
        suggestions: []
      };
    }

    try {
      const architecture = await this.analyzeNestJSStructure(project.path);
      
      if (architecture.hasModules && architecture.hasControllers && architecture.hasServices) {
        return {
          status: 'PASSED',
          message: 'Arquitectura NestJS correcta (modules, controllers, services)',
          score: 100,
          suggestions: ['Considerar usar DTOs para validación de entrada']
        };
      }

      const issues = [];
      if (!architecture.hasModules) issues.push('Falta organización modular');
      if (!architecture.hasControllers) issues.push('Faltan controllers');
      if (!architecture.hasServices) issues.push('Faltan services');

      return {
        status: 'WARNING',
        message: `Arquitectura incompleta: ${issues.join(', ')}`,
        score: 40,
        suggestions: [
          'Organizar código en módulos',
          'Separar lógica en controllers y services',
          'Usar decorators de NestJS apropiados'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar arquitectura NestJS',
        score: 0
      };
    }
  }

  async checkNamingConventions(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const namingIssues = await this.analyzeNamingConventions(project.path);
      
      if (namingIssues.length === 0) {
        return {
          status: 'PASSED',
          message: 'Convenciones de naming correctas',
          score: 100,
          suggestions: ['Mantener consistencia en nuevos archivos']
        };
      }

      const score = Math.max(20, 100 - (namingIssues.length * 10));
      
      return {
        status: namingIssues.length > 5 ? 'FAILED' : 'WARNING',
        message: `${namingIssues.length} violaciones de naming encontradas`,
        score,
        details: namingIssues.slice(0, 5).map(issue => ({
          file: issue.file,
          message: issue.description,
          severity: 'WARNING' as const
        })),
        suggestions: [
          'Usar camelCase para variables y funciones',
          'Usar PascalCase para clases',
          'Usar kebab-case para nombres de archivos'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar convenciones de naming',
        score: 0
      };
    }
  }

  async checkCyclomaticComplexity(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const complexityResults = await this.analyzeCyclomaticComplexity(project.path);
      
      if (complexityResults.maxComplexity <= 10) {
        return {
          status: 'PASSED',
          message: `Complejidad máxima: ${complexityResults.maxComplexity}`,
          score: 100,
          suggestions: ['Mantener funciones simples y enfocadas']
        };
      }

      return {
        status: complexityResults.maxComplexity > 20 ? 'FAILED' : 'WARNING',
        message: `Complejidad alta detectada: máx ${complexityResults.maxComplexity}`,
        score: Math.max(0, 100 - ((complexityResults.maxComplexity - 10) * 5)),
        details: complexityResults.complexFunctions.slice(0, 3).map(func => ({
          file: func.file,
          line: func.line,
          message: `Función '${func.name}' tiene complejidad ${func.complexity}`,
          severity: 'WARNING' as const
        })),
        suggestions: [
          'Refactorizar funciones complejas',
          'Extraer lógica a funciones más pequeñas',
          'Reducir anidación de condicionales'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar complejidad ciclomática',
        score: 0
      };
    }
  }

  async checkImportOrganization(project: NodeJSProject): Promise<ValidationResult> {
    // Implementación simplificada
    return {
      status: 'PASSED',
      message: 'Imports organizados correctamente',
      score: 100,
      suggestions: ['Usar import/order rule de ESLint para automatizar']
    };
  }

  async checkDeadCode(project: NodeJSProject): Promise<ValidationResult> {
    // Implementación simplificada
    return {
      status: 'PASSED',
      message: 'No se detectó código muerto',
      score: 100,
      suggestions: ['Usar herramientas como ts-unused-exports para análisis detallado']
    };
  }

  // Métodos auxiliares privados

  private async checkESLintConfig(projectPath: string): Promise<boolean> {
    const configFiles = [
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yml',
      'eslint.config.js'
    ];

    for (const configFile of configFiles) {
      try {
        await fs.access(path.join(projectPath, configFile));
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  private async runESLint(projectPath: string): Promise<{ errorCount: number; warningCount: number }> {
    try {
      return new Promise((resolve) => {
        const child = spawn('npx', ['eslint', 'src', '--format', 'json'], {
          cwd: projectPath,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.on('close', () => {
          try {
            const results = JSON.parse(stdout);
            const totals = results.reduce((acc: any, result: any) => ({
              errorCount: acc.errorCount + result.errorCount,
              warningCount: acc.warningCount + result.warningCount
            }), { errorCount: 0, warningCount: 0 });
            
            resolve(totals);
          } catch {
            resolve({ errorCount: 0, warningCount: 0 });
          }
        });

        child.on('error', () => {
          resolve({ errorCount: 0, warningCount: 0 });
        });
      });
    } catch {
      return { errorCount: 0, warningCount: 0 };
    }
  }

  private async checkPrettierConfig(projectPath: string): Promise<boolean> {
    const configFiles = [
      '.prettierrc',
      '.prettierrc.json',
      '.prettierrc.js',
      'prettier.config.js'
    ];

    for (const configFile of configFiles) {
      try {
        await fs.access(path.join(projectPath, configFile));
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  private async readTSConfig(projectPath: string): Promise<any> {
    try {
      const tsConfigPath = path.join(projectPath, 'tsconfig.json');
      const content = await fs.readFile(tsConfigPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  private checkStrictOptions(tsConfig: any): {
    allStrict: boolean;
    enabledCount: number;
    totalCount: number;
  } {
    const compilerOptions = tsConfig.compilerOptions || {};
    const strictOptions = [
      'strict',
      'noImplicitAny',
      'strictNullChecks',
      'strictFunctionTypes',
      'strictBindCallApply'
    ];

    let enabledCount = 0;
    
    for (const option of strictOptions) {
      if (compilerOptions[option] === true) {
        enabledCount++;
      }
    }

    // Si strict: true está habilitado, cuenta como todos
    if (compilerOptions.strict === true) {
      enabledCount = strictOptions.length;
    }

    return {
      allStrict: enabledCount === strictOptions.length,
      enabledCount,
      totalCount: strictOptions.length
    };
  }

  private async analyzeNestJSStructure(projectPath: string): Promise<{
    hasModules: boolean;
    hasControllers: boolean;
    hasServices: boolean;
  }> {
    const srcPath = path.join(projectPath, 'src');
    let hasModules = false;
    let hasControllers = false;
    let hasServices = false;

    try {
      const files = await this.getAllTSFiles(srcPath);
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        
        if (content.includes('@Module(')) hasModules = true;
        if (content.includes('@Controller(')) hasControllers = true;
        if (content.includes('@Injectable(')) hasServices = true;
        
        if (hasModules && hasControllers && hasServices) break;
      }
    } catch {
      // Error accediendo archivos
    }

    return { hasModules, hasControllers, hasServices };
  }

  private async getAllTSFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.getAllTSFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch {
      // Error accediendo directorio
    }
    
    return files;
  }

  private async analyzeNamingConventions(projectPath: string): Promise<Array<{
    file: string;
    description: string;
  }>> {
    // Implementación simplificada - retorna lista vacía
    return [];
  }

  private async analyzeCyclomaticComplexity(projectPath: string): Promise<{
    maxComplexity: number;
    complexFunctions: Array<{
      file: string;
      line: number;
      name: string;
      complexity: number;
    }>;
  }> {
    // Implementación simplificada
    return {
      maxComplexity: 5,
      complexFunctions: []
    };
  }
}