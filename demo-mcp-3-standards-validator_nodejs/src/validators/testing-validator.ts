import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { NodeJSProject, ValidationResult, TestCoverageReport } from '../types/index.js';

export class TestingValidator {

  async checkCoverageThreshold(project: NodeJSProject, threshold: number): Promise<ValidationResult> {
    try {
      console.error(`[TestingValidator] Verificando cobertura mínima ${threshold}% en: ${project.name}`);
      
      const coverage = await this.getCoverageReport(project.path);
      
      if (!coverage) {
        return {
          status: 'FAILED',
          message: 'No se encontró reporte de cobertura',
          score: 0,
          suggestions: [
            'Configurar Jest con --coverage',
            'Agregar script "test:coverage": "jest --coverage" en package.json',
            'Ejecutar tests con cobertura antes de la validación'
          ]
        };
      }

      const actualCoverage = coverage.total.lines.percentage;
      
      if (actualCoverage >= threshold) {
        return {
          status: 'PASSED',
          message: `Cobertura: ${actualCoverage.toFixed(1)}% (objetivo: ${threshold}%)`,
          score: 100,
          suggestions: ['Mantener o mejorar la cobertura actual']
        };
      }

      const score = Math.max(0, (actualCoverage / threshold) * 100);
      
      return {
        status: actualCoverage >= threshold * 0.7 ? 'WARNING' : 'FAILED',
        message: `Cobertura insuficiente: ${actualCoverage.toFixed(1)}% (objetivo: ${threshold}%)`,
        score,
        suggestions: [
          'Agregar tests para funciones sin cobertura',
          'Enfocarse en controllers y services principales',
          'Revisar archivos con cobertura menor al 80%'
        ]
      };

    } catch (error) {
      console.error(`[TestingValidator] Error verificando cobertura:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo obtener reporte de cobertura',
        score: 0
      };
    }
  }

  async checkUnitTests(project: NodeJSProject): Promise<ValidationResult> {
    try {
      console.error(`[TestingValidator] Verificando tests unitarios en: ${project.name}`);
      
      const testFiles = await this.findTestFiles(project.path);
      const srcFiles = await this.findSourceFiles(project.path);
      
      if (testFiles.length === 0) {
        return {
          status: 'FAILED',
          message: 'No se encontraron archivos de test',
          score: 0,
          suggestions: [
            'Crear archivos .spec.ts para services y controllers',
            'Seguir convención de naming: archivo.spec.ts',
            'Configurar Jest en package.json'
          ]
        };
      }

      const testCoverage = (testFiles.length / Math.max(srcFiles.length, 1)) * 100;
      
      if (testCoverage >= 80) {
        return {
          status: 'PASSED',
          message: `Tests unitarios: ${testFiles.length} archivos (${testCoverage.toFixed(1)}% cobertura de archivos)`,
          score: 100,
          suggestions: ['Continuar agregando tests para nuevos archivos']
        };
      }

      return {
        status: testCoverage >= 50 ? 'WARNING' : 'FAILED',
        message: `Tests insuficientes: ${testFiles.length}/${srcFiles.length} archivos con tests`,
        score: Math.max(20, testCoverage),
        suggestions: [
          'Priorizar tests para controllers y services críticos',
          'Agregar tests unitarios para lógica compleja',
          'Usar mocks para dependencias externas'
        ]
      };

    } catch (error) {
      console.error(`[TestingValidator] Error verificando tests unitarios:`, error);
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar tests unitarios',
        score: 0
      };
    }
  }

  async checkIntegrationTests(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const integrationTests = await this.findIntegrationTests(project.path);
      
      if (integrationTests.length === 0) {
        return {
          status: 'WARNING',
          message: 'No se encontraron tests de integración',
          score: 40,
          suggestions: [
            'Crear tests .integration.spec.ts para endpoints principales',
            'Testear flujos completos de la aplicación',
            'Usar TestingModule de NestJS para tests de integración'
          ]
        };
      }

      return {
        status: 'PASSED',
        message: `${integrationTests.length} tests de integración encontrados`,
        score: 100,
        suggestions: ['Mantener tests de integración actualizados']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar tests de integración',
        score: 0
      };
    }
  }

  async checkJestConfiguration(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const hasJest = project.packageJson.dependencies.jest || 
                     project.packageJson.devDependencies.jest ||
                     project.packageJson.devDependencies['@nestjs/testing'];

      if (!hasJest) {
        return {
          status: 'FAILED',
          message: 'Jest no está configurado',
          score: 0,
          suggestions: [
            'Instalar Jest: npm install --save-dev jest @types/jest',
            'Configurar scripts de test en package.json',
            'Crear jest.config.js si es necesario'
          ]
        };
      }

      const jestConfig = await this.checkJestConfigFile(project.path);
      const testScripts = this.checkTestScripts(project.packageJson.scripts);

      if (testScripts.hasTest && testScripts.hasCoverage) {
        return {
          status: 'PASSED',
          message: 'Jest configurado correctamente',
          score: 100,
          suggestions: ['Considerar configuraciones adicionales según necesidades']
        };
      }

      return {
        status: 'WARNING',
        message: 'Jest parcialmente configurado',
        score: 70,
        suggestions: [
          'Agregar script "test": "jest"',
          'Agregar script "test:coverage": "jest --coverage"',
          'Configurar jest.config.js para opciones avanzadas'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar configuración de Jest',
        score: 0
      };
    }
  }

  async checkE2ETests(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const e2eFiles = await this.findE2ETests(project.path);
      
      if (e2eFiles.length === 0) {
        return {
          status: 'INFO',
          message: 'No se encontraron tests E2E',
          score: 80, // No crítico, pero bueno tenerlos
          suggestions: [
            'Considerar tests E2E para flujos críticos',
            'Usar supertest para tests de API',
            'Crear carpeta test/e2e para organizar tests'
          ]
        };
      }

      return {
        status: 'PASSED',
        message: `${e2eFiles.length} tests E2E encontrados`,
        score: 100,
        suggestions: ['Expandir tests E2E para casos edge']
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar tests E2E',
        score: 0
      };
    }
  }

  async checkMockUsage(project: NodeJSProject): Promise<ValidationResult> {
    try {
      const mockUsage = await this.analyzeMockUsage(project.path);
      
      if (mockUsage.hasMocks && mockUsage.properUsage) {
        return {
          status: 'PASSED',
          message: 'Uso adecuado de mocks en tests',
          score: 100,
          suggestions: ['Continuar usando mocks para dependencias externas']
        };
      }

      if (!mockUsage.hasMocks) {
        return {
          status: 'WARNING',
          message: 'Poco uso de mocks en tests',
          score: 60,
          suggestions: [
            'Usar jest.mock() para dependencias externas',
            'Mockear servicios en tests de controllers',
            'Crear mocks reutilizables para objetos complejos'
          ]
        };
      }

      return {
        status: 'WARNING',
        message: 'Mocks presentes pero uso mejorable',
        score: 70,
        suggestions: [
          'Revisar implementación de mocks',
          'Asegurar que mocks reflejen comportamiento real',
          'Usar factory functions para mocks complejos'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar uso de mocks',
        score: 0
      };
    }
  }

  // Métodos auxiliares privados

  private async getCoverageReport(projectPath: string): Promise<TestCoverageReport | null> {
    try {
      const coveragePath = path.join(projectPath, 'coverage', 'coverage-summary.json');
      const coverageData = await fs.readFile(coveragePath, 'utf-8');
      return JSON.parse(coverageData);
    } catch {
      return null;
    }
  }

  private async findTestFiles(projectPath: string): Promise<string[]> {
    const testFiles: string[] = [];
    
    const searchInDirectory = async (dir: string, depth: number = 0): Promise<void> => {
      if (depth > 3) return;
      
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.name === 'node_modules' || entry.name === 'dist') continue;
          
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await searchInDirectory(fullPath, depth + 1);
          } else if (entry.name.includes('.spec.') || entry.name.includes('.test.')) {
            testFiles.push(fullPath);
          }
        }
      } catch {
        // Ignorar errores de acceso
      }
    };

    await searchInDirectory(projectPath);
    return testFiles;
  }

  private async findSourceFiles(projectPath: string): Promise<string[]> {
    const srcFiles: string[] = [];
    const srcPath = path.join(projectPath, 'src');
    
    const searchInDirectory = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await searchInDirectory(fullPath);
          } else if ((entry.name.endsWith('.ts') || entry.name.endsWith('.js')) && 
                     !entry.name.includes('.spec.') && 
                     !entry.name.includes('.test.')) {
            srcFiles.push(fullPath);
          }
        }
      } catch {
        // Directorio src no existe o no accesible
      }
    };

    await searchInDirectory(srcPath);
    return srcFiles;
  }

  private async findIntegrationTests(projectPath: string): Promise<string[]> {
    const integrationTests: string[] = [];
    
    const searchPaths = [
      path.join(projectPath, 'test'),
      path.join(projectPath, 'src'),
      path.join(projectPath, 'tests')
    ];

    for (const searchPath of searchPaths) {
      try {
        const files = await this.findFilesRecursive(searchPath, 
          (name) => name.includes('.integration.') || name.includes('.e2e.')
        );
        integrationTests.push(...files);
      } catch {
        // Directorio no existe
      }
    }

    return integrationTests;
  }

  private async findE2ETests(projectPath: string): Promise<string[]> {
    const e2eTests: string[] = [];
    
    const e2ePaths = [
      path.join(projectPath, 'test', 'e2e'),
      path.join(projectPath, 'e2e'),
      path.join(projectPath, 'tests', 'e2e')
    ];

    for (const e2ePath of e2ePaths) {
      try {
        const files = await this.findFilesRecursive(e2ePath, 
          (name) => name.endsWith('.ts') || name.endsWith('.js')
        );
        e2eTests.push(...files);
      } catch {
        // Directorio no existe
      }
    }

    return e2eTests;
  }

  private async findFilesRecursive(
    dir: string, 
    filter: (name: string) => boolean
  ): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.findFilesRecursive(fullPath, filter);
          files.push(...subFiles);
        } else if (filter(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignorar errores
    }
    
    return files;
  }

  private async checkJestConfigFile(projectPath: string): Promise<boolean> {
    const configFiles = [
      'jest.config.js',
      'jest.config.ts',
      'jest.config.json'
    ];

    for (const configFile of configFiles) {
      try {
        await fs.access(path.join(projectPath, configFile));
        return true;
      } catch {
        // Archivo no existe
      }
    }

    return false;
  }

  private checkTestScripts(scripts: Record<string, string>): {
    hasTest: boolean;
    hasCoverage: boolean;
  } {
    const hasTest = !!(scripts.test && !scripts.test.includes('Error: no test specified'));
    const hasCoverage = !!(scripts['test:coverage'] || scripts['test:cov'] || 
                          (scripts.test && scripts.test.includes('--coverage')));

    return { hasTest, hasCoverage };
  }

  private async analyzeMockUsage(projectPath: string): Promise<{
    hasMocks: boolean;
    properUsage: boolean;
  }> {
    const testFiles = await this.findTestFiles(projectPath);
    let mockCount = 0;
    let properMockUsage = 0;

    for (const testFile of testFiles.slice(0, 10)) { // Analizar solo los primeros 10
      try {
        const content = await fs.readFile(testFile, 'utf-8');
        
        if (content.includes('jest.mock') || content.includes('createMock') || 
            content.includes('.mockImplementation') || content.includes('.mockReturnValue')) {
          mockCount++;
          
          // Verificar uso adecuado (simplificado)
          if (content.includes('beforeEach') && content.includes('clearAllMocks')) {
            properMockUsage++;
          }
        }
      } catch {
        // Error leyendo archivo
      }
    }

    return {
      hasMocks: mockCount > 0,
      properUsage: properMockUsage / Math.max(mockCount, 1) > 0.5
    };
  }
}