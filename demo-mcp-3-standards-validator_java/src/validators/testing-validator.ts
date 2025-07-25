import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { JavaProject, ValidationResult } from '../types/index.js';

export class TestingValidator {

  async checkCoverageThreshold(project: JavaProject, minThreshold: number): Promise<ValidationResult> {
    try {
      console.error(`[TestingValidator] Verificando cobertura mínima ${minThreshold}%: ${project.name}`);
      
      const hasJaCoCo = project.projectInfo.plugins.some(plugin => 
        plugin.artifactId === 'jacoco-maven-plugin'
      );

      if (!hasJaCoCo) {
        return {
          status: 'FAILED',
          message: 'Plugin JaCoCo no configurado',
          score: 0,
          suggestions: [
            'Agregar jacoco-maven-plugin al pom.xml',
            'Configurar goal prepare-agent y report',
            'Establecer thresholds de cobertura'
          ]
        };
      }

      const coverageReport = await this.getCoverageReport(project.path);
      
      if (coverageReport.lineCoverage >= minThreshold) {
        return {
          status: 'PASSED',
          message: `Cobertura: ${coverageReport.lineCoverage}% (>=${minThreshold}%)`,
          score: 100,
          suggestions: ['Mantener cobertura alta agregando tests']
        };
      }

      return {
        status: 'FAILED',
        message: `Cobertura: ${coverageReport.lineCoverage}% (<${minThreshold}%)`,
        score: Math.max(0, (coverageReport.lineCoverage / minThreshold) * 100),
        suggestions: [
          'Agregar tests unitarios faltantes',
          'Cubrir casos edge y manejo de errores',
          'Revisar clases con baja cobertura'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar cobertura',
        score: 0,
        suggestions: ['Ejecutar mvn test jacoco:report primero']
      };
    }
  }

  async checkUnitTests(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[TestingValidator] Verificando tests unitarios: ${project.name}`);
      
      const testStats = await this.analyzeTestCoverage(project.path);
      
      if (testStats.servicesCovered === 0 && testStats.controllersCovered === 0) {
        return {
          status: 'FAILED',
          message: 'No se encontraron tests unitarios',
          score: 0,
          suggestions: [
            'Crear tests para services con @ExtendWith(MockitoExtension.class)',
            'Crear tests para controllers con @WebMvcTest',
            'Usar Mockito para mocking de dependencias'
          ]
        };
      }

      const totalClasses = testStats.totalServices + testStats.totalControllers;
      const coveredClasses = testStats.servicesCovered + testStats.controllersCovered;
      const coverageRatio = totalClasses > 0 ? (coveredClasses / totalClasses) * 100 : 0;

      if (coverageRatio >= 80) {
        return {
          status: 'PASSED',
          message: `${coveredClasses}/${totalClasses} clases con tests (${coverageRatio.toFixed(1)}%)`,
          score: 100,
          suggestions: ['Continuar escribiendo tests para nuevas funcionalidades']
        };
      }

      return {
        status: 'WARNING',
        message: `${coveredClasses}/${totalClasses} clases con tests (${coverageRatio.toFixed(1)}%)`,
        score: Math.max(40, coverageRatio),
        suggestions: [
          'Agregar tests faltantes para services',
          'Crear tests para controllers críticos',
          'Implementar tests de repository con @DataJpaTest'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo analizar tests unitarios',
        score: 0
      };
    }
  }

  async checkIntegrationTests(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[TestingValidator] Verificando tests de integración: ${project.name}`);
      
      const integrationTests = await this.findIntegrationTests(project.path);
      
      if (integrationTests.length === 0) {
        return {
          status: 'WARNING',
          message: 'No se encontraron tests de integración',
          score: 60,
          suggestions: [
            'Crear tests con @SpringBootTest',
            'Usar @TestPropertySource para configuración',
            'Implementar tests de API endpoints completos'
          ]
        };
      }

      const hasSpringBootTest = integrationTests.some(test => 
        test.content.includes('@SpringBootTest')
      );

      if (hasSpringBootTest) {
        return {
          status: 'PASSED',
          message: `${integrationTests.length} tests de integración encontrados`,
          score: 100,
          suggestions: ['Agregar más scenarios de integración según sea necesario']
        };
      }

      return {
        status: 'WARNING',
        message: `${integrationTests.length} tests encontrados pero sin @SpringBootTest`,
        score: 70,
        suggestions: [
          'Usar @SpringBootTest para tests de integración',
          'Configurar @TestConfiguration para beans de test',
          'Usar @MockBean para servicios externos'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar tests de integración',
        score: 0
      };
    }
  }

  async checkJUnitVersion(project: JavaProject): Promise<ValidationResult> {
    try {
      console.error(`[TestingValidator] Verificando versión JUnit: ${project.name}`);
      
      const junit4 = project.projectInfo.dependencies.find(dep => 
        dep.groupId === 'junit' && dep.artifactId === 'junit'
      );

      const junit5 = project.projectInfo.dependencies.find(dep => 
        dep.groupId === 'org.junit.jupiter' || 
        dep.artifactId.includes('junit-jupiter')
      );

      if (junit4 && !junit5) {
        return {
          status: 'FAILED',
          message: 'Usando JUnit 4 (versión obsoleta)',
          score: 20,
          suggestions: [
            'Migrar a JUnit 5 (jupiter)',
            'Reemplazar @Test con org.junit.jupiter.api.Test',
            'Actualizar assertions y assumptions'
          ]
        };
      }

      if (junit5) {
        return {
          status: 'PASSED',
          message: 'Usando JUnit 5 (jupiter)',
          score: 100,
          suggestions: ['Aprovechar nuevas features de JUnit 5']
        };
      }

      return {
        status: 'WARNING',
        message: 'Framework de testing no detectado',
        score: 50,
        suggestions: [
          'Agregar junit-jupiter-engine',
          'Configurar maven-surefire-plugin para JUnit 5'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar versión JUnit',
        score: 0
      };
    }
  }

  async checkTestNamingConvention(project: JavaProject): Promise<ValidationResult> {
    try {
      const testFiles = await this.findTestFiles(project.path);
      const invalidNames = testFiles.filter(file => 
        !path.basename(file).endsWith('Test.java') && 
        !path.basename(file).endsWith('Tests.java')
      );

      if (invalidNames.length === 0) {
        return {
          status: 'PASSED',
          message: `${testFiles.length} archivos de test con naming correcto`,
          score: 100,
          suggestions: ['Continuar usando *Test.java o *Tests.java']
        };
      }

      return {
        status: 'WARNING',
        message: `${invalidNames.length}/${testFiles.length} archivos con naming incorrecto`,
        score: Math.max(60, 100 - (invalidNames.length * 10)),
        details: invalidNames.slice(0, 3).map(file => ({
          file: path.relative(project.path, file),
          message: 'Nombre no sigue convención *Test.java',
          severity: 'WARNING' as const
        })),
        suggestions: [
          'Renombrar archivos para terminar en Test.java',
          'Usar sufijo Tests.java para test suites'
        ]
      };

    } catch (error) {
      return {
        status: 'SKIPPED',
        message: 'No se pudo verificar naming convention',
        score: 0
      };
    }
  }

  async checkMockUsage(project: JavaProject): Promise<ValidationResult> {
    try {
      const hasMockito = project.projectInfo.dependencies.some(dep => 
        dep.artifactId === 'mockito-core' || dep.artifactId === 'mockito-junit-jupiter'
      );

      if (!hasMockito) {
        return {
          status: 'WARNING',
          message: 'Mockito no configurado',
          score: 60,
          suggestions: [
            'Agregar mockito-junit-jupiter',
            'Usar @Mock y @InjectMocks para testing',
            'Implementar mocking de servicios externos'
          ]
        };
      }

      const mockUsage = await this.analyzeMockUsage(project.path);
      
      if (mockUsage.testsWithMocks > 0) {
        return {
          status: 'PASSED',
          message: `Mockito usado en ${mockUsage.testsWithMocks} clases de test`,
          score: 100,
          suggestions: ['Continuar usando mocks apropiadamente']
        };
      }

      return {
        status: 'WARNING',
        message: 'Mockito configurado pero no utilizado',
        score: 70,
        suggestions: [
          'Usar @Mock para dependencias en tests',
          'Implementar @InjectMocks en classes bajo test',
          'Usar when().thenReturn() para behavior mocking'
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

  private async getCoverageReport(projectPath: string): Promise<{
    lineCoverage: number;
    branchCoverage: number;
  }> {
    // Implementación simplificada - buscar reports de JaCoCo
    const jacocoPath = path.join(projectPath, 'target', 'site', 'jacoco', 'index.html');
    
    try {
      const content = await fs.readFile(jacocoPath, 'utf-8');
      // Parse HTML para extraer cobertura (implementación simplificada)
      const lineCoverageMatch = content.match(/Instructions.*?(\d+)%/);
      const lineCoverage = lineCoverageMatch ? parseInt(lineCoverageMatch[1]) : 0;
      
      return {
        lineCoverage,
        branchCoverage: lineCoverage // Simplificado
      };
    } catch {
      return { lineCoverage: 0, branchCoverage: 0 };
    }
  }

  private async analyzeTestCoverage(projectPath: string): Promise<{
    totalServices: number;
    totalControllers: number;
    servicesCovered: number;
    controllersCovered: number;
  }> {
    try {
      const srcPath = path.join(projectPath, 'src', 'main', 'java');
      const testPath = path.join(projectPath, 'src', 'test', 'java');

      const services = await this.findJavaFiles(srcPath, '*Service.java');
      const controllers = await this.findJavaFiles(srcPath, '*Controller.java');
      const testFiles = await this.findJavaFiles(testPath);

      let servicesCovered = 0;
      let controllersCovered = 0;

      for (const service of services) {
        const serviceName = path.basename(service, '.java');
        const hasTest = testFiles.some(test => 
          path.basename(test).includes(serviceName)
        );
        if (hasTest) servicesCovered++;
      }

      for (const controller of controllers) {
        const controllerName = path.basename(controller, '.java');
        const hasTest = testFiles.some(test => 
          path.basename(test).includes(controllerName)
        );
        if (hasTest) controllersCovered++;
      }

      return {
        totalServices: services.length,
        totalControllers: controllers.length,
        servicesCovered,
        controllersCovered
      };
    } catch {
      return { totalServices: 0, totalControllers: 0, servicesCovered: 0, controllersCovered: 0 };
    }
  }

  private async findIntegrationTests(projectPath: string): Promise<Array<{
    file: string;
    content: string;
  }>> {
    const results: Array<{ file: string; content: string }> = [];
    const testPath = path.join(projectPath, 'src', 'test', 'java');
    
    const testFiles = await this.findJavaFiles(testPath, '*IT.java');
    testFiles.push(...await this.findJavaFiles(testPath, '*IntegrationTest.java'));
    
    for (const file of testFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        results.push({ file, content });
      } catch {
        // Error leyendo archivo
      }
    }
    
    return results;
  }

  private async findTestFiles(projectPath: string): Promise<string[]> {
    const testPath = path.join(projectPath, 'src', 'test', 'java');
    return await this.findJavaFiles(testPath);
  }

  private async analyzeMockUsage(projectPath: string): Promise<{
    testsWithMocks: number;
  }> {
    try {
      const testFiles = await this.findTestFiles(projectPath);
      let testsWithMocks = 0;
      
      for (const testFile of testFiles) {
        try {
          const content = await fs.readFile(testFile, 'utf-8');
          if (content.includes('@Mock') || content.includes('@InjectMocks') || 
              content.includes('Mockito.')) {
            testsWithMocks++;
          }
        } catch {
          // Error leyendo archivo
        }
      }
      
      return { testsWithMocks };
    } catch {
      return { testsWithMocks: 0 };
    }
  }

  private async findJavaFiles(basePath: string, pattern: string = '*.java'): Promise<string[]> {
    const files: string[] = [];
    
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

    await searchInDirectory(basePath);
    return files;
  }
}