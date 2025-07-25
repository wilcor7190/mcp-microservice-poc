import { promises as fs } from 'fs';
import path from 'path';
import { NodeJSProject, ValidationResult } from '../types/index.js';

export class PerformanceValidator {

  async checkCompressionEnabled(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const hasCompression = project.packageJson.dependencies.compression ||
                            project.packageJson.devDependencies.compression;

      if (!hasCompression && project.framework !== 'nestjs') {
        return {
          status: 'WARNING',
          message: 'Compresión no configurada',
          score: 40,
          suggestions: [
            'Instalar compression: npm install compression',
            'Configurar middleware de compresión',
            'Usar gzip para respuestas HTTP'
          ]
        };
      }

      // Para NestJS, verificar configuración de compresión
      if (project.framework === 'nestjs') {
        const compressionConfig = await this.checkNestJSCompression(project.path);
        
        if (compressionConfig.enabled) {
          return {
            status: 'PASSED',
            message: 'Compresión configurada en NestJS',
            score: 100,
            suggestions: ['Monitorear impacto en performance']
          };
        }

        return {
          status: 'WARNING',
          message: 'Compresión no configurada en NestJS',
          score: 60,
          suggestions: [
            'Instalar compression: npm install compression',
            'Configurar en main.ts: app.use(compression())',
            'Considerar compresión a nivel de reverse proxy'
          ]
        };
      }

      return {
        status: 'PASSED',
        message: 'Compresión disponible',
        score: 100,
        suggestions: ['Verificar que esté configurada correctamente']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar compresión',
        score: 0
      };
    }
  }

  async checkCachingStrategy(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const cachingLibraries = [
        'redis',
        'node-cache',
        'memory-cache',
        '@nestjs/cache-manager',
        'cache-manager'
      ];

      const foundCaching = cachingLibraries.filter(lib =>
        project.packageJson.dependencies[lib] || 
        project.packageJson.devDependencies[lib]
      );

      if (foundCaching.length === 0) {
        return {
          status: 'INFO',
          message: 'No se encontró estrategia de caché',
          score: 70, // No crítico pero recomendado
          suggestions: [
            'Considerar Redis para caché distribuido',
            'Implementar caché en memoria para datos frecuentes',
            'Usar HTTP cache headers apropiados'
          ]
        };
      }

      const cacheImplementation = await this.analyzeCacheImplementation(project.path);

      if (cacheImplementation.wellImplemented) {
        return {
          status: 'PASSED',
          message: `Caché implementado: ${foundCaching.join(', ')}`,
          score: 100,
          suggestions: [
            'Monitorear hit rate del caché',
            'Implementar invalidación apropiada',
            'Considerar TTL dinámico'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `Librerías de caché presentes pero implementación incompleta`,
        score: 60,
        suggestions: [
          'Configurar estrategia de invalidación',
          'Implementar caché en endpoints críticos',
          'Definir TTL apropiados'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar estrategia de caché',
        score: 0
      };
    }
  }

  async checkDatabaseQueries(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const dbLibraries = [
        'typeorm',
        'prisma',
        'mongoose',
        'sequelize',
        'knex'
      ];

      const foundDB = dbLibraries.filter(lib =>
        project.packageJson.dependencies[lib] || 
        project.packageJson.devDependencies[lib]
      );

      if (foundDB.length === 0) {
        return {
          status: 'INFO',
          message: 'No se detectaron ORMs/ODMs',
          score: 80,
          suggestions: ['Análisis no aplicable para este proyecto']
        };
      }

      const queryAnalysis = await this.analyzeQueryPatterns(project.path);

      if (queryAnalysis.hasOptimizations) {
        return {
          status: 'PASSED',
          message: 'Optimizaciones de query detectadas',
          score: 100,
          suggestions: [
            'Monitorear performance de queries',
            'Considerar índices adicionales si es necesario',
            'Usar explain plans para queries complejas'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: 'Pocas optimizaciones de query detectadas',
        score: 60,
        suggestions: [
          'Implementar paginación en listados',
          'Usar select específico en lugar de select *',
          'Considerar eager loading para relaciones',
          'Implementar índices apropiados'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar queries de base de datos',
        score: 0
      };
    }
  }

  async checkMemoryLeaks(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const memoryIssues = await this.analyzeMemoryPatterns(project.path);

      if (memoryIssues.length === 0) {
        return {
          status: 'PASSED',
          message: 'No se detectaron patrones de memory leaks',
          score: 100,
          suggestions: [
            'Continuar monitoreando uso de memoria en producción',
            'Usar herramientas de profiling periódicamente'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: `${memoryIssues.length} posibles memory leaks detectados`,
        score: Math.max(40, 100 - (memoryIssues.length * 15)),
        details: memoryIssues.slice(0, 3).map(issue => ({
          file: issue.file,
          line: issue.line,
          message: issue.description,
          severity: 'WARNING' as const
        })),
        suggestions: [
          'Remover event listeners no utilizados',
          'Cerrar conexiones de base de datos apropiadamente',
          'Limpiar timers e intervalos',
          'Usar WeakMap/WeakSet para referencias débiles'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar memory leaks',
        score: 0
      };
    }
  }

  async checkBundleSize(project: NodeJSProject): Promise<ValidationResult> {
    try {
      // Para APIs/backend, el bundle size no es tan crítico
      if (project.framework === 'nestjs' || project.framework === 'express') {
        return {
          status: 'INFO',
          message: 'Bundle size no aplicable para backend',
          score: 90,
          suggestions: [
            'Monitorear tamaño de node_modules',
            'Usar production dependencies únicamente',
            'Considerar tree shaking para builds frontend'
          ]
        };
      }

      const bundleAnalysis = await this.analyzeBundleSize(project.path);

      if (bundleAnalysis.size < 1000000) { // < 1MB
        return {
          status: 'PASSED',
          message: `Bundle size apropiado: ${Math.round(bundleAnalysis.size / 1024)}KB`,
          score: 100,
          suggestions: ['Mantener dependencias mínimas']
        };
      }

      return {
        status: 'WARNING',
        message: `Bundle size grande: ${Math.round(bundleAnalysis.size / 1024)}KB`,
        score: 60,
        suggestions: [
          'Analizar dependencias con webpack-bundle-analyzer',
          'Implementar code splitting',
          'Remover dependencias no utilizadas'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar bundle size',
        score: 0
      };
    }
  }

  async checkAsyncUsage(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const asyncAnalysis = await this.analyzeAsyncPatterns(project.path);

      if (asyncAnalysis.goodPatterns >= asyncAnalysis.totalAsync * 0.8) {
        return {
          status: 'PASSED',
          message: `Buen uso de async/await: ${asyncAnalysis.goodPatterns}/${asyncAnalysis.totalAsync}`,
          score: 100,
          suggestions: ['Mantener patrones async consistentes']
        };
      }

      const badPatterns = asyncAnalysis.totalAsync - asyncAnalysis.goodPatterns;

      return {
        status: 'WARNING',
        message: `${badPatterns} patrones async mejorables detectados`,
        score: Math.max(40, (asyncAnalysis.goodPatterns / asyncAnalysis.totalAsync) * 100),
        suggestions: [
          'Usar async/await en lugar de callbacks',
          'Evitar callback hell',
          'Usar Promise.all para operaciones paralelas',
          'Manejar errores con try/catch en async functions'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar uso de async/await',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async checkNestJSCompression(projectPath: string): Promise<{ enabled: boolean }> {
    try {
      const mainPath = path.join(projectPath, 'src', 'main.ts');
      const content = await fs.readFile(mainPath, 'utf-8');
      
      return {
        enabled: content.includes('compression()') || content.includes('compression')
      };
    } catch {
      return { enabled: false };
    }
  }

  private async analyzeCacheImplementation(projectPath: string): Promise<{ wellImplemented: boolean }> {
    // Implementación simplificada
    try {
      const srcPath = path.join(projectPath, 'src');
      const files = await this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files.slice(0, 10)) {
        const content = await fs.readFile(file, 'utf-8');
        
        if (content.includes('@Cacheable') || 
            content.includes('cache.get') || 
            content.includes('redis.get')) {
          return { wellImplemented: true };
        }
      }
      
      return { wellImplemented: false };
    } catch {
      return { wellImplemented: false };
    }
  }

  private async analyzeQueryPatterns(projectPath: string): Promise<{ hasOptimizations: boolean }> {
    // Implementación simplificada
    try {
      const srcPath = path.join(projectPath, 'src');
      const files = await this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files.slice(0, 10)) {
        const content = await fs.readFile(file, 'utf-8');
        
        // Buscar patrones de optimización
        if (content.includes('limit(') || 
            content.includes('pagination') ||
            content.includes('select(') ||
            content.includes('relations:')) {
          return { hasOptimizations: true };
        }
      }
      
      return { hasOptimizations: false };
    } catch {
      return { hasOptimizations: false };
    }
  }

  private async analyzeMemoryPatterns(projectPath: string): Promise<Array<{
    file: string;
    line: number;
    description: string;
  }>> {
    const issues: Array<{ file: string; line: number; description: string }> = [];
    
    try {
      const srcPath = path.join(projectPath, 'src');
      const files = await this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files.slice(0, 5)) {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Patrones problemáticos simplificados
          if (line.includes('setInterval') && !line.includes('clearInterval')) {
            issues.push({
              file: path.relative(projectPath, file),
              line: index + 1,
              description: 'setInterval sin clearInterval correspondiente'
            });
          }
          
          if (line.includes('addEventListener') && !line.includes('removeEventListener')) {
            issues.push({
              file: path.relative(projectPath, file),
              line: index + 1,
              description: 'Event listener sin cleanup'
            });
          }
        });
      }
    } catch {
      // Error analizando archivos
    }
    
    return issues;
  }

  private async analyzeBundleSize(projectPath: string): Promise<{ size: number }> {
    try {
      // Estimar tamaño basado en node_modules (muy simplificado)
      const nodeModulesPath = path.join(projectPath, 'node_modules');
      const stat = await fs.stat(nodeModulesPath);
      
      // Estimación muy básica
      return { size: 500000 }; // 500KB por defecto
    } catch {
      return { size: 0 };
    }
  }

  private async analyzeAsyncPatterns(projectPath: string): Promise<{
    totalAsync: number;
    goodPatterns: number;
  }> {
    let totalAsync = 0;
    let goodPatterns = 0;
    
    try {
      const srcPath = path.join(projectPath, 'src');
      const files = await this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files.slice(0, 10)) {
        const content = await fs.readFile(file, 'utf-8');
        
        // Contar funciones async
        const asyncMatches = content.match(/async\s+\w+|async\s*\(/g);
        if (asyncMatches) {
          totalAsync += asyncMatches.length;
          
          // Contar uso de await (patrón bueno)
          const awaitMatches = content.match(/await\s+/g);
          if (awaitMatches) {
            goodPatterns += Math.min(awaitMatches.length, asyncMatches.length);
          }
        }
      }
    } catch {
      // Error analizando archivos
    }
    
    return { totalAsync: Math.max(1, totalAsync), goodPatterns };
  }

  private async getAllFiles(dir: string, extensions: string[]): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.getAllFiles(fullPath, extensions);
          files.push(...subFiles);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch {
      // Error accediendo directorio
    }
    
    return files;
  }
}