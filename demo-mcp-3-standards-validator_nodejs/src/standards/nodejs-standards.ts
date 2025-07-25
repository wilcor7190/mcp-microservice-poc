import { ValidationRule, NodeJSProject, ValidationResult, ValidationCategory } from '../types/index.js';
import { SecurityValidator } from '../validators/security-validator.js';
import { TestingValidator } from '../validators/testing-validator.js';
import { CodeQualityValidator } from '../validators/code-quality-validator.js';
import { DocumentationValidator } from '../validators/documentation-validator.js';
import { PerformanceValidator } from '../validators/performance-validator.js';

/**
 * Estándares de desarrollo para proyectos Node.js/NestJS
 * Basados en las mejores prácticas de la industria y lineamientos empresariales
 */
export class NodeJSStandards {
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
   * Reglas de seguridad para Node.js/NestJS
   */
  private getSecurityRules(): ValidationRule[] {
    return [
      {
        id: 'SEC001',
        name: 'Dependencias Seguras',
        description: 'Verificar que no existan vulnerabilidades conocidas en las dependencias',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.securityValidator.checkVulnerabilities(project)
      },
      {
        id: 'SEC002', 
        name: 'Variables de Entorno',
        description: 'Verificar que no haya secrets hardcodeados en el código',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.securityValidator.checkHardcodedSecrets(project)
      },
      {
        id: 'SEC003',
        name: 'Helmet Middleware',
        description: 'Verificar uso de helmet para headers de seguridad (NestJS/Express)',
        category: 'security',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.securityValidator.checkHelmetUsage(project)
      },
      {
        id: 'SEC004',
        name: 'CORS Configurado',
        description: 'Verificar configuración adecuada de CORS',
        category: 'security',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.securityValidator.checkCorsConfiguration(project)
      },
      {
        id: 'SEC005',
        name: 'Validación de Input',
        description: 'Verificar uso de pipes de validación (NestJS) o middleware de validación',
        category: 'security',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.securityValidator.checkInputValidation(project)
      },
      {
        id: 'SEC006',
        name: 'Rate Limiting',
        description: 'Verificar implementación de rate limiting',
        category: 'security',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.securityValidator.checkRateLimiting(project)
      }
    ];
  }

  /**
   * Reglas de testing para Node.js/NestJS
   */
  private getTestingRules(): ValidationRule[] {
    return [
      {
        id: 'TEST001',
        name: 'Cobertura Mínima',
        description: 'Verificar cobertura de código mínima del 80%',
        category: 'testing',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.testingValidator.checkCoverageThreshold(project, 80)
      },
      {
        id: 'TEST002',
        name: 'Tests Unitarios',
        description: 'Verificar existencia de tests unitarios para servicios y controladores',
        category: 'testing',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.testingValidator.checkUnitTests(project)
      },
      {
        id: 'TEST003',
        name: 'Tests de Integración',
        description: 'Verificar existencia de tests de integración para endpoints principales',
        category: 'testing',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.testingValidator.checkIntegrationTests(project)
      },
      {
        id: 'TEST004',
        name: 'Configuración Jest',
        description: 'Verificar configuración adecuada de Jest',
        category: 'testing',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.testingValidator.checkJestConfiguration(project)
      },
      {
        id: 'TEST005',
        name: 'Tests E2E',
        description: 'Verificar existencia de tests end-to-end para flujos críticos',
        category: 'testing',
        severity: 'INFO',
        validator: async (project: NodeJSProject) => this.testingValidator.checkE2ETests(project)
      },
      {
        id: 'TEST006',
        name: 'Mocks y Stubs',
        description: 'Verificar uso adecuado de mocks para dependencias externas',
        category: 'testing',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.testingValidator.checkMockUsage(project)
      }
    ];
  }

  /**
   * Reglas de calidad de código para Node.js/NestJS
   */
  private getCodeQualityRules(): ValidationRule[] {
    return [
      {
        id: 'QUAL001',
        name: 'ESLint Configurado',
        description: 'Verificar configuración y ejecución de ESLint',
        category: 'codeQuality',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkESLintConfiguration(project)
      },
      {
        id: 'QUAL002',
        name: 'Prettier Configurado',
        description: 'Verificar configuración de Prettier para formateo consistente',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkPrettierConfiguration(project)
      },
      {
        id: 'QUAL003',
        name: 'TypeScript Strict',
        description: 'Verificar configuración strict de TypeScript',
        category: 'codeQuality',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkTypeScriptStrict(project)
      },
      {
        id: 'QUAL004',
        name: 'Arquitectura NestJS',
        description: 'Verificar estructura modular correcta (modules, controllers, services)',
        category: 'codeQuality',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkNestJSArchitecture(project)
      },
      {
        id: 'QUAL005',
        name: 'Convenciones de Naming',
        description: 'Verificar convenciones de nombres (camelCase, PascalCase, kebab-case)',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkNamingConventions(project)
      },
      {
        id: 'QUAL006',
        name: 'Complejidad Ciclomática',
        description: 'Verificar complejidad ciclomática baja (máx 10 por función)',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkCyclomaticComplexity(project)
      },
      {
        id: 'QUAL007',
        name: 'Imports Organizados',
        description: 'Verificar organización de imports (externos, internos, relativos)',
        category: 'codeQuality',
        severity: 'INFO',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkImportOrganization(project)
      },
      {
        id: 'QUAL008',
        name: 'Dead Code',
        description: 'Verificar ausencia de código no utilizado',
        category: 'codeQuality',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.codeQualityValidator.checkDeadCode(project)
      }
    ];
  }

  /**
   * Reglas de documentación para Node.js/NestJS
   */
  private getDocumentationRules(): ValidationRule[] {
    return [
      {
        id: 'DOC001',
        name: 'README Completo',
        description: 'Verificar existencia y completitud del README.md',
        category: 'documentation',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.documentationValidator.checkReadmeCompleteness(project)
      },
      {
        id: 'DOC002',
        name: 'Swagger/OpenAPI',
        description: 'Verificar documentación de API con Swagger/OpenAPI',
        category: 'documentation',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.documentationValidator.checkSwaggerDocumentation(project)
      },
      {
        id: 'DOC003',
        name: 'JSDoc en Funciones',
        description: 'Verificar documentación JSDoc en funciones públicas',
        category: 'documentation',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.documentationValidator.checkJSDocCoverage(project)
      },
      {
        id: 'DOC004',
        name: 'Changelog',
        description: 'Verificar existencia de CHANGELOG.md',
        category: 'documentation',
        severity: 'INFO',
        validator: async (project: NodeJSProject) => this.documentationValidator.checkChangelogExists(project)
      },
      {
        id: 'DOC005',
        name: 'Documentación de Deployment',
        description: 'Verificar documentación de despliegue (Docker, K8s)',
        category: 'documentation',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.documentationValidator.checkDeploymentDocs(project)
      }
    ];
  }

  /**
   * Reglas de rendimiento para Node.js/NestJS
   */
  private getPerformanceRules(): ValidationRule[] {
    return [
      {
        id: 'PERF001',
        name: 'Compresión Habilitada',
        description: 'Verificar uso de compresión (gzip) en respuestas HTTP',
        category: 'performance',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.performanceValidator.checkCompressionEnabled(project)
      },
      {
        id: 'PERF002',
        name: 'Caching Strategy',
        description: 'Verificar implementación de estrategia de caché',
        category: 'performance',
        severity: 'INFO',
        validator: async (project: NodeJSProject) => this.performanceValidator.checkCachingStrategy(project)
      },
      {
        id: 'PERF003',
        name: 'Database Queries',
        description: 'Verificar optimización de queries de base de datos',
        category: 'performance',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.performanceValidator.checkDatabaseQueries(project)
      },
      {
        id: 'PERF004',
        name: 'Memory Leaks',
        description: 'Verificar ausencia de memory leaks potenciales',
        category: 'performance',
        severity: 'ERROR',
        validator: async (project: NodeJSProject) => this.performanceValidator.checkMemoryLeaks(project)
      },
      {
        id: 'PERF005',
        name: 'Bundle Size',
        description: 'Verificar tamaño razonable del bundle (si aplica)',
        category: 'performance',
        severity: 'INFO',
        validator: async (project: NodeJSProject) => this.performanceValidator.checkBundleSize(project)
      },
      {
        id: 'PERF006',
        name: 'Async/Await Usage',
        description: 'Verificar uso correcto de async/await vs callbacks',
        category: 'performance',
        severity: 'WARNING',
        validator: async (project: NodeJSProject) => this.performanceValidator.checkAsyncUsage(project)
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