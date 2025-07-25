import { ValidationRule, JavaProject, ValidationResult, ValidationCategory } from '../types/index.js';
import { SecurityValidator } from '../validators/security-validator.js';
import { TestingValidator } from '../validators/testing-validator.js';
import { CodeQualityValidator } from '../validators/code-quality-validator.js';
import { DocumentationValidator } from '../validators/documentation-validator.js';
import { PerformanceValidator } from '../validators/performance-validator.js';

/**
 * Estándares de desarrollo para proyectos Java/Spring Boot
 * Basados en las mejores prácticas de la industria y lineamientos empresariales
 */
export class JavaStandards {
  private securityValidator = new SecurityValidator();
  private testingValidator = new TestingValidator();
  private codeQualityValidator = new CodeQualityValidator();
  private documentationValidator = new DocumentationValidator();
  private performanceValidator = new PerformanceValidator();

  /**
   * Obtiene todas las reglas de validación organizadas por categoría
   */
  getAllRules(): Map<ValidationCategory, ValidationRule[]> {
    const rules = new Map<ValidationCategory, ValidationRule[]>();

    rules.set('security', this.getSecurityRules());
    rules.set('testing', this.getTestingRules());
    rules.set('codeQuality', this.getCodeQualityRules());
    rules.set('documentation', this.getDocumentationRules());
    rules.set('performance', this.getPerformanceRules());

    return rules;
  }

  /**
   * Reglas de seguridad para Java/Spring Boot
   */
  private getSecurityRules(): ValidationRule[] {
    return [
      {
        id: 'SEC_JAVA_001',
        name: 'Dependencias Seguras',
        description: 'Verificar ausencia de vulnerabilidades conocidas en dependencias Maven/Gradle',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.securityValidator.checkVulnerabilities(project)
      },
      {
        id: 'SEC_JAVA_002',
        name: 'Spring Security Configurado',
        description: 'Verificar configuración de Spring Security para endpoints',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.securityValidator.checkSpringSecurityConfig(project)
      },
      {
        id: 'SEC_JAVA_003',
        name: 'Validación de Input',
        description: 'Verificar uso de @Valid y Bean Validation en controllers',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.securityValidator.checkInputValidation(project)
      },
      {
        id: 'SEC_JAVA_004',
        name: 'Secrets Externalizados',
        description: 'Verificar que credentials estén en application.properties/yml',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.securityValidator.checkSecretsExternalization(project)
      },
      {
        id: 'SEC_JAVA_005',
        name: 'CORS Configurado',
        description: 'Verificar configuración segura de CORS en aplicación',
        category: 'security',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.securityValidator.checkCorsConfiguration(project)
      },
      {
        id: 'SEC_JAVA_006',
        name: 'Logging Seguro',
        description: 'Verificar que no se loggeen datos sensibles',
        category: 'security',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.securityValidator.checkSecureLogging(project)
      }
    ];
  }

  /**
   * Reglas de testing para Java/Spring Boot
   */
  private getTestingRules(): ValidationRule[] {
    return [
      {
        id: 'TEST_JAVA_001',
        name: 'Cobertura Mínima',
        description: 'Verificar cobertura de código mínima del 80% con JaCoCo',
        category: 'testing',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.testingValidator.checkCoverageThreshold(project, 80)
      },
      {
        id: 'TEST_JAVA_002',
        name: 'Tests Unitarios',
        description: 'Verificar tests unitarios para services y controllers',
        category: 'testing',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.testingValidator.checkUnitTests(project)
      },
      {
        id: 'TEST_JAVA_003',
        name: 'Tests de Integración',
        description: 'Verificar tests de integración con @SpringBootTest',
        category: 'testing',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.testingValidator.checkIntegrationTests(project)
      },
      {
        id: 'TEST_JAVA_004',
        name: 'JUnit 5 Configuration',
        description: 'Verificar uso de JUnit 5 en lugar de JUnit 4',
        category: 'testing',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.testingValidator.checkJUnitVersion(project)
      },
      {
        id: 'TEST_JAVA_005',
        name: 'Test Naming Convention',
        description: 'Verificar convenciones de naming en tests (*Test.java)',
        category: 'testing',
        severity: 'INFO',
        validator: async (project: JavaProject) => this.testingValidator.checkTestNamingConvention(project)
      },
      {
        id: 'TEST_JAVA_006',
        name: 'Mock Usage',
        description: 'Verificar uso apropiado de Mockito para mocking',
        category: 'testing',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.testingValidator.checkMockUsage(project)
      }
    ];
  }

  /**
   * Reglas de calidad de código para Java/Spring Boot
   */
  private getCodeQualityRules(): ValidationRule[] {
    return [
      {
        id: 'QUAL_JAVA_001',
        name: 'Arquitectura Spring Boot',
        description: 'Verificar estructura correcta con @SpringBootApplication, @Controller, @Service',
        category: 'codeQuality',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkSpringBootArchitecture(project)
      },
      {
        id: 'QUAL_JAVA_002',
        name: 'Package Structure',
        description: 'Verificar organización de packages por layers (controller, service, repository)',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkPackageStructure(project)
      },
      {
        id: 'QUAL_JAVA_003',
        name: 'Java Code Conventions',
        description: 'Verificar convenciones Java (CamelCase, indentación, etc.)',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkJavaConventions(project)
      },
      {
        id: 'QUAL_JAVA_004',
        name: 'Exception Handling',
        description: 'Verificar manejo apropiado de excepciones (@ControllerAdvice)',
        category: 'codeQuality',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkExceptionHandling(project)
      },
      {
        id: 'QUAL_JAVA_005',
        name: 'Dependency Injection',
        description: 'Verificar uso correcto de @Autowired y constructor injection',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkDependencyInjection(project)
      },
      {
        id: 'QUAL_JAVA_006',
        name: 'Code Complexity',
        description: 'Verificar complejidad ciclomática baja en métodos',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkCodeComplexity(project)
      },
      {
        id: 'QUAL_JAVA_007',
        name: 'Static Analysis',
        description: 'Verificar ausencia de code smells con herramientas como PMD/SpotBugs',
        category: 'codeQuality',
        severity: 'INFO',
        validator: async (project: JavaProject) => this.codeQualityValidator.checkStaticAnalysis(project)
      }
    ];
  }

  /**
   * Reglas de documentación para Java/Spring Boot
   */
  private getDocumentationRules(): ValidationRule[] {
    return [
      {
        id: 'DOC_JAVA_001',
        name: 'README Completo',
        description: 'Verificar README.md con instalación, configuración y uso',
        category: 'documentation',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.documentationValidator.checkReadmeCompleteness(project)
      },
      {
        id: 'DOC_JAVA_002',
        name: 'Swagger/OpenAPI',
        description: 'Verificar documentación de API con SpringDoc OpenAPI',
        category: 'documentation',
        severity: 'ERROR',
        validator: async (project: JavaProject) => this.documentationValidator.checkSwaggerDocumentation(project)
      },
      {
        id: 'DOC_JAVA_003',
        name: 'JavaDoc Coverage',
        description: 'Verificar JavaDoc en clases y métodos públicos',
        category: 'documentation',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.documentationValidator.checkJavaDocCoverage(project)
      },
      {
        id: 'DOC_JAVA_004',
        name: 'Application Properties',
        description: 'Verificar documentación de propiedades de configuración',
        category: 'documentation',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.documentationValidator.checkConfigurationDocs(project)
      },
      {
        id: 'DOC_JAVA_005',
        name: 'Docker Documentation',
        description: 'Verificar Dockerfile y documentación de containerización',
        category: 'documentation',
        severity: 'INFO',
        validator: async (project: JavaProject) => this.documentationValidator.checkDockerDocumentation(project)
      }
    ];
  }

  /**
   * Reglas de rendimiento para Java/Spring Boot
   */
  private getPerformanceRules(): ValidationRule[] {
    return [
      {
        id: 'PERF_JAVA_001',
        name: 'Database Optimization',
        description: 'Verificar uso de JPA repositories con paginación y queries optimizadas',
        category: 'performance',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.performanceValidator.checkDatabaseOptimization(project)
      },
      {
        id: 'PERF_JAVA_002',
        name: 'Caching Strategy',
        description: 'Verificar implementación de caché con @Cacheable',
        category: 'performance',
        severity: 'INFO',
        validator: async (project: JavaProject) => this.performanceValidator.checkCachingStrategy(project)
      },
      {
        id: 'PERF_JAVA_003',
        name: 'Connection Pool',
        description: 'Verificar configuración de connection pool (HikariCP)',
        category: 'performance',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.performanceValidator.checkConnectionPool(project)
      },
      {
        id: 'PERF_JAVA_004',
        name: 'Async Processing',
        description: 'Verificar uso de @Async para operaciones no bloqueantes',
        category: 'performance',
        severity: 'INFO',
        validator: async (project: JavaProject) => this.performanceValidator.checkAsyncProcessing(project)
      },
      {
        id: 'PERF_JAVA_005',
        name: 'Memory Management',
        description: 'Verificar configuraciones JVM y ausencia de memory leaks',
        category: 'performance',
        severity: 'WARNING',
        validator: async (project: JavaProject) => this.performanceValidator.checkMemoryManagement(project)
      },
      {
        id: 'PERF_JAVA_006',
        name: 'Monitoring & Metrics',
        description: 'Verificar configuración de Actuator y métricas',
        category: 'performance',
        severity: 'INFO',
        validator: async (project: JavaProject) => this.performanceValidator.checkMonitoringMetrics(project)
      }
    ];
  }

  /**
   * Obtiene pesos de las categorías para el cálculo del score general
   */
  getCategoryWeights(): Map<ValidationCategory, number> {
    return new Map([
      ['security', 30],      // 30% - Crítico para producción
      ['testing', 25],       // 25% - Fundamental para calidad
      ['codeQuality', 20],   // 20% - Mantenibilidad a largo plazo
      ['documentation', 15], // 15% - Importante para el equipo
      ['performance', 10]    // 10% - Optimización
    ]);
  }

  /**
   * Obtiene configuración de umbrales para diferentes estados
   */
  getScoreThresholds(): { passed: number; warning: number } {
    return {
      passed: 80,   // >= 80 puntos = PASSED
      warning: 60   // 60-79 puntos = WARNING, <60 = FAILED
    };
  }
}