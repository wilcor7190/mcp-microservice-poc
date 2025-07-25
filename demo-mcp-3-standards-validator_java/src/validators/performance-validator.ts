import { promises as fs } from 'fs';
import path from 'path';
import { JavaProject, ValidationResult } from '../types/index.js';

export class PerformanceValidator {

  async checkDatabaseOptimization(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[PerformanceValidator] Verificando optimización de base de datos: ${project.name}`);
      
      const hasJPA = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'spring-boot-starter-data-jpa' ||
        dep.artifactId === 'spring-data-jpa'
      );

      if (!hasJPA) {
        return {
          status: 'INFO',
          message: 'No usa JPA/Spring Data',
          score: 80,
          suggestions: []
        };
      }

      const dbOptimization = await this.analyzeDatabaseOptimization(project.path);
      
      let score = 60; // Base score
      const suggestions: string[] = [];

      if (dbOptimization.hasPagination) {
        score += 20;
      } else {
        suggestions.push('Implementar paginación con Pageable en repositories');
      }

      if (dbOptimization.hasCustomQueries) {
        score += 10;
      } else {
        suggestions.push('Usar @Query para consultas optimizadas');
      }

      if (dbOptimization.hasLazyLoading) {
        score += 10;
      } else {
        suggestions.push('Configurar @Lazy loading apropiadamente');
      }

      if (score >= 90) {
        return {
          status: 'PASSED',
          message: 'Base de datos optimizada correctamente',
          score: 100,
          suggestions: ['Continuar monitoreando performance de queries']
        };
      }

      return {
        status: 'WARNING',
        message: `Optimización parcial de BD (${score}/100)`,
        score,
        suggestions
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar optimización de BD',
        score: 0
      };
    }
  }

  async checkCachingStrategy(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[PerformanceValidator] Verificando estrategia de caché: ${project.name}`);
      
      const hasCacheStarter = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'spring-boot-starter-cache'
      );

      const hasRedis = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'spring-boot-starter-data-redis'
      );

      if (!hasCacheStarter && !hasRedis) {
        return {
          status: 'INFO',
          message: 'Sin implementación de caché',
          score: 70,
          suggestions: [
            'Considerar spring-boot-starter-cache',
            'Evaluar Redis para caché distribuido',
            'Implementar @Cacheable en métodos costosos'
          ]
        };
      }

      const cacheUsage = await this.analyzeCacheUsage(project.path);
      
      if (cacheUsage.methodsWithCache > 0 && cacheUsage.hasCacheConfig) {
        return {
          status: 'PASSED',
          message: `Caché implementado en ${cacheUsage.methodsWithCache} métodos`,
          score: 100,
          suggestions: ['Monitorear hit rate y ajustar TTL según sea necesario']
        };
      }

      if (cacheUsage.methodsWithCache > 0) {
        return {
          status: 'WARNING',
          message: `${cacheUsage.methodsWithCache} métodos con caché pero sin configuración`,
          score: 70,
          suggestions: [
            'Configurar CacheManager apropiadamente',
            'Definir estrategias de evicción',
            'Configurar TTL para diferentes caches'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: 'Caché configurado pero no utilizado',
        score: 60,
        suggestions: [
          'Usar @Cacheable en métodos que consultan datos',
          'Implementar @CacheEvict para invalidación',
          'Considerar @Caching para operaciones complejas'
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

  async checkConnectionPool(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[PerformanceValidator] Verificando connection pool: ${project.name}`);
      
      const hasHikariCP = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'HikariCP'
      ) || project.springBootVersion; // HikariCP es default en Spring Boot 2+

      if (!hasHikariCP) {
        return {
          status: 'WARNING',
          message: 'Connection pool no configurado explícitamente',
          score: 50,
          suggestions: [
            'Configurar HikariCP como connection pool',
            'Definir tamaño mínimo y máximo de pool',
            'Configurar timeout de conexiones'
          ]
        };
      }

      const poolConfig = await this.analyzeConnectionPoolConfig(project.path);
      
      if (poolConfig.hasCustomConfig) {
        return {
          status: 'PASSED',
          message: 'Connection pool configurado correctamente',
          score: 100,
          suggestions: [
            'Monitorear métricas de connection pool',
            'Ajustar configuración según carga'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: 'Usando configuración default de connection pool',
        score: 70,
        suggestions: [
          'Configurar spring.datasource.hikari.maximum-pool-size',
          'Establecer spring.datasource.hikari.minimum-idle',
          'Configurar connection timeout apropiado'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar connection pool',
        score: 0
      };
    }
  }

  async checkAsyncProcessing(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[PerformanceValidator] Verificando procesamiento asíncrono: ${project.name}`);
      
      const asyncUsage = await this.analyzeAsyncUsage(project.path);
      
      if (asyncUsage.hasAsyncConfig && asyncUsage.methodsWithAsync > 0) {
        return {
          status: 'PASSED',
          message: `${asyncUsage.methodsWithAsync} métodos asíncronos configurados`,
          score: 100,
          suggestions: [
            'Continuar usando @Async para operaciones no bloqueantes',
            'Monitorear thread pool usage'
          ]
        };
      }

      if (asyncUsage.methodsWithAsync > 0 && !asyncUsage.hasAsyncConfig) {
        return {
          status: 'WARNING',
          message: 'Métodos @Async sin configuración de TaskExecutor',
          score: 60,
          suggestions: [
            'Configurar @EnableAsync en clase de configuración',
            'Definir custom TaskExecutor bean',
            'Configurar thread pool size apropiado'
          ]
        };
      }

      return {
        status: 'INFO',
        message: 'Sin procesamiento asíncrono implementado',
        score: 70,
        suggestions: [
          'Considerar @Async para operaciones costosas',
          'Implementar @EnableAsync para habilitar',
          'Usar CompletableFuture para operaciones no bloqueantes'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar procesamiento asíncrono',
        score: 0
      };
    }
  }

  async checkMemoryManagement(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[PerformanceValidator] Verificando gestión de memoria: ${project.name}`);
      
      const memoryAnalysis = await this.analyzeMemoryManagement(project.path);
      
      let score = 70; // Base score
      const suggestions: string[] = [];

      if (memoryAnalysis.hasJVMConfig) {
        score += 15;
      } else {
        suggestions.push('Configurar -Xms y -Xmx en application.properties');
      }

      if (memoryAnalysis.hasGCConfig) {
        score += 10;
      } else {
        suggestions.push('Configurar Garbage Collector apropiado');
      }

      if (memoryAnalysis.potentialLeaks === 0) {
        score += 15;
      } else {
        suggestions.push(`Revisar ${memoryAnalysis.potentialLeaks} posibles memory leaks`);
      }

      if (score >= 90) {
        return {
          status: 'PASSED',
          message: 'Gestión de memoria optimizada',
          score: 100,
          suggestions: ['Continuar monitoreando heap usage']
        };
      }

      return {
        status: 'WARNING',
        message: `Gestión de memoria parcial (${score}/100)`,
        score,
        suggestions
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar gestión de memoria',
        score: 0
      };
    }
  }

  async checkMonitoringMetrics(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[PerformanceValidator] Verificando monitoring y métricas: ${project.name}`);
      
      const hasActuator = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'spring-boot-starter-actuator'
      );

      const hasMicrometer = project.projectInfo.dependencies.some(dep => 
        dep.artifactId.includes('micrometer')
      );

      if (!hasActuator && !hasMicrometer) {
        return {
          status: 'INFO',
          message: 'Sin herramientas de monitoring configuradas',
          score: 60,
          suggestions: [
            'Agregar spring-boot-starter-actuator',
            'Configurar micrometer para métricas',
            'Exponer endpoints de health y metrics'
          ]
        };
      }

      const monitoringConfig = await this.analyzeMonitoringConfig(project.path);
      
      let score = 70; // Base score con actuator
      const suggestions: string[] = [];

      if (monitoringConfig.hasHealthChecks) {
        score += 15;
      } else {
        suggestions.push('Implementar custom health indicators');
      }

      if (monitoringConfig.hasCustomMetrics) {
        score += 10;
      } else {
        suggestions.push('Agregar custom metrics con @Timed o Counter');
      }

      if (monitoringConfig.hasPrometheusConfig) {
        score += 5;
      } else {
        suggestions.push('Configurar Prometheus para métricas');
      }

      if (score >= 90) {
        return {
          status: 'PASSED',
          message: 'Monitoring completamente configurado',
          score: 100,
          suggestions: ['Configurar alertas basadas en métricas']
        };
      }

      return {
        status: 'WARNING',
        message: `Monitoring parcial (${score}/100)`,
        score,
        suggestions
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar monitoring',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async analyzeDatabaseOptimization(projectPath: string): Promise<{
    hasPagination: boolean;
    hasCustomQueries: boolean;
    hasLazyLoading: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let hasPagination = false;
      let hasCustomQueries = false;
      let hasLazyLoading = false;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          if (content.includes('Pageable') || content.includes('Page<')) {
            hasPagination = true;
          }
          
          if (content.includes('@Query') || content.includes('@NamedQuery')) {
            hasCustomQueries = true;
          }
          
          if (content.includes('FetchType.LAZY') || content.includes('@Lazy')) {
            hasLazyLoading = true;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { hasPagination, hasCustomQueries, hasLazyLoading };
    } catch {
      return { hasPagination: false, hasCustomQueries: false, hasLazyLoading: false };
    }
  }

  private async analyzeCacheUsage(projectPath: string): Promise<{
    methodsWithCache: number;
    hasCacheConfig: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let methodsWithCache = 0;
      let hasCacheConfig = false;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          const cacheAnnotations = (content.match(/@Cacheable|@CacheEvict|@CachePut/g) || []).length;
          methodsWithCache += cacheAnnotations;
          
          if (content.includes('@EnableCaching') || content.includes('CacheManager')) {
            hasCacheConfig = true;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { methodsWithCache, hasCacheConfig };
    } catch {
      return { methodsWithCache: 0, hasCacheConfig: false };
    }
  }

  private async analyzeConnectionPoolConfig(projectPath: string): Promise<{
    hasCustomConfig: boolean;
  }> {
    try {
      const configFiles = [
        'application.properties',
        'application.yml',
        'application.yaml'
      ];

      for (const configFile of configFiles) {
        try {
          const configPath = path.join(projectPath, 'src', 'main', 'resources', configFile);
          const content = await fs.readFile(configPath, 'utf-8');
          
          if (content.includes('hikari') || content.includes('pool-size') || 
              content.includes('connection-timeout')) {
            return { hasCustomConfig: true };
          }
        } catch {
          // Archivo no existe
        }
      }

      return { hasCustomConfig: false };
    } catch {
      return { hasCustomConfig: false };
    }
  }

  private async analyzeAsyncUsage(projectPath: string): Promise<{
    methodsWithAsync: number;
    hasAsyncConfig: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let methodsWithAsync = 0;
      let hasAsyncConfig = false;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          const asyncMethods = (content.match(/@Async/g) || []).length;
          methodsWithAsync += asyncMethods;
          
          if (content.includes('@EnableAsync') || content.includes('TaskExecutor')) {
            hasAsyncConfig = true;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { methodsWithAsync, hasAsyncConfig };
    } catch {
      return { methodsWithAsync: 0, hasAsyncConfig: false };
    }
  }

  private async analyzeMemoryManagement(projectPath: string): Promise<{
    hasJVMConfig: boolean;
    hasGCConfig: boolean;
    potentialLeaks: number;
  }> {
    try {
      let hasJVMConfig = false;
      let hasGCConfig = false;
      let potentialLeaks = 0;

      // Verificar configuración JVM
      const configFiles = ['application.properties', 'application.yml', 'Dockerfile'];
      
      for (const configFile of configFiles) {
        try {
          const filePath = configFile === 'Dockerfile' ? 
            path.join(projectPath, configFile) :
            path.join(projectPath, 'src', 'main', 'resources', configFile);
            
          const content = await fs.readFile(filePath, 'utf-8');
          
          if (content.includes('-Xms') || content.includes('-Xmx')) {
            hasJVMConfig = true;
          }
          
          if (content.includes('-XX:') && content.includes('GC')) {
            hasGCConfig = true;
          }
        } catch {
          // Archivo no existe
        }
      }

      // Buscar posibles memory leaks (implementación simplificada)
      const javaFiles = await this.findJavaFiles(projectPath);
      
      for (const file of javaFiles.slice(0, 10)) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          // Detectar patrones que pueden causar memory leaks
          if (content.includes('static') && content.includes('List<') && 
              !content.includes('Collections.unmodifiable')) {
            potentialLeaks++;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      return { hasJVMConfig, hasGCConfig, potentialLeaks };
    } catch {
      return { hasJVMConfig: false, hasGCConfig: false, potentialLeaks: 0 };
    }
  }

  private async analyzeMonitoringConfig(projectPath: string): Promise<{
    hasHealthChecks: boolean;
    hasCustomMetrics: boolean;
    hasPrometheusConfig: boolean;
  }> {
    try {
      const javaFiles = await this.findJavaFiles(projectPath);
      let hasHealthChecks = false;
      let hasCustomMetrics = false;
      let hasPrometheusConfig = false;

      for (const file of javaFiles) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          
          if (content.includes('HealthIndicator') || content.includes('@Component')) {
            hasHealthChecks = true;
          }
          
          if (content.includes('@Timed') || content.includes('Counter') || 
              content.includes('MeterRegistry')) {
            hasCustomMetrics = true;
          }
        } catch {
          // Error leyendo archivo
        }
      }

      // Verificar configuración Prometheus
      const configFiles = ['application.properties', 'application.yml'];
      
      for (const configFile of configFiles) {
        try {
          const configPath = path.join(projectPath, 'src', 'main', 'resources', configFile);
          const content = await fs.readFile(configPath, 'utf-8');
          
          if (content.includes('prometheus') || content.includes('micrometer')) {
            hasPrometheusConfig = true;
          }
        } catch {
          // Archivo no existe
        }
      }

      return { hasHealthChecks, hasCustomMetrics, hasPrometheusConfig };
    } catch {
      return { hasHealthChecks: false, hasCustomMetrics: false, hasPrometheusConfig: false };
    }
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