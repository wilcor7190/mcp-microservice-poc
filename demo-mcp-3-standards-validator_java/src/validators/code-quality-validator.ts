import { promises as fs } from 'fs';
import path from 'path';
import { JavaProject, ValidationResult } from '../types/index.js';

export class CodeQualityValidator {

  async checkSpringBootArchitecture(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando arquitectura Spring Boot: ${project.name}`);
      
      if (project.framework !== 'spring-boot') {
        return {
          status: 'INFO',
          message: 'No es un proyecto Spring Boot',
          score: 80,
          suggestions: []
        };
      }

      const archCheck = await this.validateSpringBootStructure(project.path);
      
      if (archCheck.hasMainApp && archCheck.hasControllers && archCheck.hasServices) {
        return {
          status: 'PASSED',
          message: 'Arquitectura Spring Boot correcta',
          score: 100,
          suggestions: ['Continuar siguiendo patrones de arquitectura']
        };
      }

      const missing: string[] = [];
      if (!archCheck.hasMainApp) missing.push('@SpringBootApplication');
      if (!archCheck.hasControllers) missing.push('@Controller/@RestController');
      if (!archCheck.hasServices) missing.push('@Service');

      return {
        status: 'FAILED',
        message: `Componentes faltantes: ${missing.join(', ')}`,
        score: Math.max(30, 100 - (missing.length * 25)),
        suggestions: [
          'Crear clase main con @SpringBootApplication',
          'Implementar controllers con @RestController',
          'Crear services con @Service para lógica de negocio'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar arquitectura',
        score: 0
      };
    }
  }

  async checkPackageStructure(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando estructura de packages: ${project.name}`);
      
      const packageStructure = await this.analyzePackageStructure(project.path);
      
      const expectedLayers = ['controller', 'service', 'repository'];
      const foundLayers = expectedLayers.filter(layer => 
        packageStructure.packages.some(pkg => pkg.includes(layer))
      );

      if (foundLayers.length === expectedLayers.length) {
        return {
          status: 'PASSED',
          message: `Estructura por capas correcta: ${foundLayers.join(', ')}`,
          score: 100,
          suggestions: ['Mantener separación clara entre capas']
        };
      }

      const missingLayers = expectedLayers.filter(layer => !foundLayers.includes(layer));
      
      return {
        status: 'WARNING',
        message: `Capas faltantes: ${missingLayers.join(', ')}`,
        score: Math.max(60, (foundLayers.length / expectedLayers.length) * 100),
        suggestions: [
          'Organizar clases en packages: controller, service, repository',
          'Separar DTOs en package model o dto',
          'Agrupar configuraciones en package config'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar estructura de packages',
        score: 0
      };
    }
  }

  async checkJavaConventions(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando convenciones Java: ${project.name}`);
      
      const conventionIssues = await this.scanForConventionViolations(project.path);
      
      if (conventionIssues.length === 0) {
        return {
          status: 'PASSED',
          message: 'Convenciones Java respetadas',
          score: 100,
          suggestions: ['Continuar siguiendo Java naming conventions']
        };
      }

      const criticalIssues = conventionIssues.filter(issue => 
        issue.type === 'class-naming' || issue.type === 'constant-naming'
      );

      if (criticalIssues.length > 0) {
        return {
          status: 'FAILED',
          message: `${criticalIssues.length} violaciones críticas de naming`,
          score: Math.max(40, 100 - (criticalIssues.length * 15)),
          details: criticalIssues.slice(0, 5).map(issue => ({
            file: issue.file,
            line: issue.line,
            message: issue.description,
            severity: 'ERROR' as const
          })),
          suggestions: [
            'Usar PascalCase para nombres de clases',
            'Usar UPPER_SNAKE_CASE para constantes',
            'Usar camelCase para métodos y variables'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `${conventionIssues.length} violaciones menores encontradas`,
        score: Math.max(70, 100 - (conventionIssues.length * 5)),
        suggestions: [
          'Revisar naming conventions',
          'Configurar checkstyle o spotless',
          'Usar IDE formatting automático'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar convenciones',
        score: 0
      };
    }
  }

  async checkExceptionHandling(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando manejo de excepciones: ${project.name}`);
      
      const exceptionHandling = await this.analyzeExceptionHandling(project.path);
      
      if (exceptionHandling.hasGlobalHandler && exceptionHandling.hasCustomExceptions) {
        return {
          status: 'PASSED',
          message: 'Manejo de excepciones implementado correctamente',
          score: 100,
          suggestions: ['Continuar usando @ControllerAdvice para manejo global']
        };
      }

      if (!exceptionHandling.hasGlobalHandler && !exceptionHandling.hasCustomExceptions) {
        return {
          status: 'FAILED',
          message: 'No se encontró manejo de excepciones',
          score: 20,
          suggestions: [
            'Crear @ControllerAdvice para manejo global',
            'Implementar custom exceptions',
            'Definir ResponseEntity para errores estándar'
          ]
        };
      }

      const score = (exceptionHandling.hasGlobalHandler ? 60 : 0) + 
                   (exceptionHandling.hasCustomExceptions ? 40 : 0);

      return {
        status: 'WARNING',
        message: 'Manejo de excepciones parcialmente implementado',
        score,
        suggestions: [
          !exceptionHandling.hasGlobalHandler ? 'Agregar @ControllerAdvice' : '',
          !exceptionHandling.hasCustomExceptions ? 'Crear custom exceptions' : '',
          'Implementar logging estructurado de errores'
        ].filter(Boolean)
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar manejo de excepciones',
        score: 0
      };
    }
  }

  async checkDependencyInjection(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando dependency injection: ${project.name}`);
      
      const diAnalysis = await this.analyzeDependencyInjection(project.path);
      
      const constructorInjectionRatio = diAnalysis.totalClasses > 0 ? 
        (diAnalysis.constructorInjection / diAnalysis.totalClasses) * 100 : 0;

      if (constructorInjectionRatio >= 80) {
        return {
          status: 'PASSED',
          message: `${constructorInjectionRatio.toFixed(1)}% usa constructor injection`,
          score: 100,
          suggestions: ['Continuar usando constructor injection como práctica preferida']
        };
      }

      if (diAnalysis.fieldInjection > diAnalysis.constructorInjection) {
        return {
          status: 'WARNING',
          message: `Más field injection (${diAnalysis.fieldInjection}) que constructor injection (${diAnalysis.constructorInjection})`,
          score: 60,
          suggestions: [
            'Preferir constructor injection sobre @Autowired en fields',
            'Usar @RequiredArgsConstructor de Lombok',
            'Constructor injection facilita testing'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `Constructor injection: ${constructorInjectionRatio.toFixed(1)}%`,
        score: Math.max(50, constructorInjectionRatio),
        suggestions: [
          'Incrementar uso de constructor injection',
          'Evitar @Autowired en fields cuando sea posible',
          'Considerar usar Lombok para constructors'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar dependency injection',
        score: 0
      };
    }
  }

  async checkCodeComplexity(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando complejidad de código: ${project.name}`);
      
      const complexityAnalysis = await this.analyzeCodeComplexity(project.path);
      
      const highComplexityMethods = complexityAnalysis.methods.filter(method => 
        method.complexity > 10
      );

      if (highComplexityMethods.length === 0) {
        return {
          status: 'PASSED',
          message: `Complejidad promedio: ${complexityAnalysis.averageComplexity.toFixed(1)}`,
          score: 100,
          suggestions: ['Mantener métodos simples y enfocados']
        };
      }

      if (highComplexityMethods.length > 5) {
        return {
          status: 'FAILED',
          message: `${highComplexityMethods.length} métodos con alta complejidad`,
          score: Math.max(30, 100 - (highComplexityMethods.length * 10)),
          details: highComplexityMethods.slice(0, 3).map(method => ({
            file: path.relative(project.path, method.file),
            line: method.line,
            message: `Complejidad: ${method.complexity} (límite: 10)`,
            severity: 'ERROR' as const
          })),
          suggestions: [
            'Refactorizar métodos complejos',
            'Extraer lógica a métodos privados',
            'Aplicar principio de responsabilidad única'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `${highComplexityMethods.length} métodos con complejidad > 10`,
        score: 70,
        suggestions: [
          'Simplificar métodos complejos',
          'Usar early returns para reducir anidamiento',
          'Considerar refactoring a multiple methods'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar complejidad',
        score: 0
      };
    }
  }

  async checkStaticAnalysis(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[CodeQualityValidator] Verificando static analysis: ${project.name}`);
      
      const hasSpotBugs = project.projectInfo.plugins.some(plugin => 
        plugin.artifactId === 'spotbugs-maven-plugin'
      );

      const hasPMD = project.projectInfo.plugins.some(plugin => 
        plugin.artifactId === 'maven-pmd-plugin'
      );

      const hasCheckstyle = project.projectInfo.plugins.some(plugin => 
        plugin.artifactId === 'maven-checkstyle-plugin'
      );

      const toolsCount = [hasSpotBugs, hasPMD, hasCheckstyle].filter(Boolean).length;

      if (toolsCount >= 2) {
        return {
          status: 'PASSED',
          message: `${toolsCount} herramientas de análisis configuradas`,
          score: 100,
          suggestions: ['Ejecutar análisis regularmente en CI/CD']
        };
      }

      if (toolsCount === 1) {
        return {
          status: 'WARNING',
          message: `Solo ${toolsCount} herramienta de análisis configurada`,
          score: 70,
          suggestions: [
            'Agregar SpotBugs para detectar bugs',
            'Configurar PMD para code smells',
            'Usar Checkstyle para convenciones'
          ]
        };
      }

      return {
        status: 'INFO',
        message: 'Sin herramientas de análisis estático configuradas',
        score: 60,
        suggestions: [
          'Configurar SpotBugs, PMD o Checkstyle',
          'Integrar análisis en pipeline de CI',
          'Establecer quality gates'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar static analysis',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async validateSpringBootStructure(projectPath: string): Promise<{
    hasMainApp: boolean;
    hasControllers: boolean;
    hasServices: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let hasMainApp = false;
      let hasControllers = false;
      let hasServices = false;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          if (content.includes('@SpringBootApplication')) {
            hasMainApp = true;
          }
          if (content.includes('@Controller') || content.includes('@RestController')) {
            hasControllers = true;
          }
          if (content.includes('@Service')) {
            hasServices = true;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { hasMainApp, hasControllers, hasServices };
    } catch {
      return { hasMainApp: false, hasControllers: false, hasServices: false };
    }
  }

  private async analyzePackageStructure(projectPath: string): Promise<{
    packages: string[];
  }> {
    const packages: Set<string> = new Set();
    const srcPath = path.join(projectPath, 'src', 'main', 'java');
    
    const collectPackages = async (dir: string, basePackage: string = ''): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const packageName = basePackage ? `${basePackage}.${entry.name}` : entry.name;
            packages.add(packageName);
            await collectPackages(path.join(dir, entry.name), packageName);
          }
        }
      } catch {
        // Error accediendo directorio
      }
    };

    await collectPackages(srcPath);
    return { packages: Array.from(packages) };
  }

  private async scanForConventionViolations(projectPath: string): Promise<Array<{
    file: string;
    line: number;
    type: string;
    description: string;
  }>> {
    const violations: Array<{ file: string; line: number; type: string; description: string }> = [];
    const javaFiles = await this.findJavaFiles(projectPath);
    
    for (const file of javaFiles.slice(0, 20)) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Verificar naming de clases
          const classMatch = line.match(/^public class ([a-z][A-Za-z0-9]*)/);
          if (classMatch) {
            violations.push({
              file: path.relative(projectPath, file),
              line: index + 1,
              type: 'class-naming',
              description: `Clase debe empezar con mayúscula: ${classMatch[1]}`
            });
          }

          // Verificar constantes
          const constantMatch = line.match(/private static final [A-Z][a-z]/);
          if (constantMatch) {
            violations.push({
              file: path.relative(projectPath, file),
              line: index + 1,
              type: 'constant-naming',
              description: 'Constante debe usar UPPER_SNAKE_CASE'
            });
          }
        });
      } catch {
        // Error leyendo archivo
      }
    }
    
    return violations;
  }

  private async analyzeExceptionHandling(projectPath: string): Promise<{
    hasGlobalHandler: boolean;
    hasCustomExceptions: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let hasGlobalHandler = false;
      let hasCustomExceptions = false;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          if (content.includes('@ControllerAdvice') || content.includes('@ExceptionHandler')) {
            hasGlobalHandler = true;
          }
          
          if (content.includes('extends Exception') || content.includes('extends RuntimeException')) {
            hasCustomExceptions = true;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { hasGlobalHandler, hasCustomExceptions };
    } catch {
      return { hasGlobalHandler: false, hasCustomExceptions: false };
    }
  }

  private async analyzeDependencyInjection(projectPath: string): Promise<{
    totalClasses: number;
    constructorInjection: number;
    fieldInjection: number;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let totalClasses = 0;
      let constructorInjection = 0;
      let fieldInjection = 0;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          if (content.includes('@Service') || content.includes('@Controller') || 
              content.includes('@Repository') || content.includes('@Component')) {
            totalClasses++;
            
            // Constructor injection (simplified detection)
            if (content.includes('public ' + path.basename(file, '.java') + '(') &&
                !content.includes('@Autowired')) {
              constructorInjection++;
            }
            
            // Field injection
            if (content.includes('@Autowired') && content.match(/@Autowired\s+private/)) {
              fieldInjection++;
            }
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { totalClasses, constructorInjection, fieldInjection };
    } catch {
      return { totalClasses: 0, constructorInjection: 0, fieldInjection: 0 };
    }
  }

  private async analyzeCodeComplexity(projectPath: string): Promise<{
    averageComplexity: number;
    methods: Array<{ file: string; line: number; complexity: number; name: string }>;
  }> {
    // Implementación simplificada de análisis de complejidad ciclomática
    const methods: Array<{ file: string; line: number; complexity: number; name: string }> = [];
    const javaFiles = await this.findJavaFiles(projectPath);
    
    for (const file of javaFiles.slice(0, 10)) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          const methodMatch = line.match(/public\s+\w+\s+(\w+)\s*\(/);
          if (methodMatch) {
            // Cálculo simplificado de complejidad basado en estructuras de control
            const methodContent = content.substring(content.indexOf(line));
            const complexity = 1 + 
              (methodContent.match(/\bif\b/g) || []).length +
              (methodContent.match(/\bfor\b/g) || []).length +
              (methodContent.match(/\bwhile\b/g) || []).length +
              (methodContent.match(/\bswitch\b/g) || []).length +
              (methodContent.match(/\bcatch\b/g) || []).length;
            
            methods.push({
              file,
              line: index + 1,
              complexity,
              name: methodMatch[1]
            });
          }
        });
      } catch {
        // Error leyendo archivo
      }
    }
    
    const averageComplexity = methods.length > 0 ? 
      methods.reduce((sum, method) => sum + method.complexity, 0) / methods.length : 0;
    
    return { averageComplexity, methods };
  }

  private async findJavaFiles(projectPath: string): Promise<string[]> {
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
            files.push(fullPath);
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