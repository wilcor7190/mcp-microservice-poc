#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { parseString as parseXML } from 'xml2js';
import { JavaStandards } from './standards/java-standards.js';
import { 
  JavaProject, 
  JavaValidationReport, 
  ValidationCategory, 
  CategoryReport,
  RuleReport,
  Recommendation,
  ValidationSummary
} from './types/index.js';

/**
 * MCP Server especializado para validar estándares de desarrollo en microservicios Java/Spring Boot
 * 
 * Herramientas disponibles:
 * - validate-java-project: Valida un proyecto Java contra estándares definidos
 * - get-java-standards: Obtiene lista de estándares aplicables
 * - analyze-java-project: Analiza estructura y dependencias del proyecto
 */
class JavaStandardsValidatorServer {
  private server: Server;
  private standards: JavaStandards;

  constructor() {
    this.server = new Server(
      {
        name: 'java-standards-validator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.standards = new JavaStandards();
    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'validate-java-project',
            description: 'Valida un proyecto Java/Spring Boot contra estándares de desarrollo establecidos',
            inputSchema: {
              type: 'object',
              properties: {
                projectPath: {
                  type: 'string',
                  description: 'Ruta absoluta al proyecto Java a validar'
                },
                categories: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['security', 'testing', 'codeQuality', 'documentation', 'performance', 'all']
                  },
                  description: 'Categorías específicas a validar (opcional, default: all)',
                  default: ['all']
                },
                includeDetails: {
                  type: 'boolean',
                  description: 'Incluir detalles específicos de violaciones',
                  default: true
                }
              },
              required: ['projectPath']
            }
          },
          {
            name: 'get-java-standards',
            description: 'Obtiene la lista completa de estándares Java/Spring Boot aplicables',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['security', 'testing', 'codeQuality', 'documentation', 'performance'],
                  description: 'Categoría específica de estándares (opcional)'
                }
              }
            }
          },
          {
            name: 'analyze-java-project',
            description: 'Analiza la estructura, dependencias y configuración de un proyecto Java',
            inputSchema: {
              type: 'object',
              properties: {
                projectPath: {
                  type: 'string',
                  description: 'Ruta absoluta al proyecto Java a analizar'
                }
              },
              required: ['projectPath']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'validate-java-project':
            return await this.validateJavaProject(args);

          case 'get-java-standards':
            return await this.getJavaStandards(args);

          case 'analyze-java-project':
            return await this.analyzeJavaProject(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Herramienta desconocida: ${name}`
            );
        }
      } catch (error) {
        console.error(`[${name}] Error:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Error ejecutando ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async validateJavaProject(args: any) {
    const { projectPath, categories = ['all'], includeDetails = true } = args;

    if (!projectPath) {
      throw new McpError(ErrorCode.InvalidParams, 'projectPath es requerido');
    }

    console.error(`[JavaValidator] Iniciando validación de proyecto: ${projectPath}`);

    // Verificar que el proyecto existe
    try {
      await fs.access(projectPath);
    } catch (error) {
      throw new McpError(ErrorCode.InvalidParams, `Proyecto no encontrado: ${projectPath}`);
    }

    // Analizar proyecto Java
    const javaProject = await this.parseJavaProject(projectPath);
    console.error(`[JavaValidator] Proyecto analizado: ${javaProject.name} (${javaProject.framework})`);

    // Determinar categorías a validar
    const categoriesToValidate: ValidationCategory[] = categories.includes('all') 
      ? ['security', 'testing', 'codeQuality', 'documentation', 'performance']
      : categories;

    // Obtener reglas aplicables
    const allRules = this.standards.getAllRules();
    const rulesToExecute = categoriesToValidate.flatMap(category => 
      allRules.get(category) || []
    );

    console.error(`[JavaValidator] Ejecutando ${rulesToExecute.length} reglas de validación...`);

    // Ejecutar validaciones
    const startTime = Date.now();
    const categoryReports: CategoryReport[] = [];

    for (const category of categoriesToValidate) {
      const categoryRules = allRules.get(category) || [];
      const ruleReports: RuleReport[] = [];

      for (const rule of categoryRules) {
        try {
          const result = await rule.validator(javaProject);
          ruleReports.push({ rule, result });
          console.error(`[${rule.id}] ${result.status} - Score: ${result.score}`);
        } catch (error) {
          console.error(`[${rule.id}] Error en validación:`, error);
          ruleReports.push({
            rule,
            result: {
              status: 'SKIPPED',
              message: 'Error durante validación',
              score: 0
            }
          });
        }
      }

      // Calcular score de categoría
      const categoryScore = ruleReports.length > 0 
        ? ruleReports.reduce((sum, report) => sum + report.result.score, 0) / ruleReports.length
        : 0;

      const categoryStatus = categoryScore >= 80 ? 'PASSED' : 
                           categoryScore >= 60 ? 'WARNING' : 'FAILED';

      categoryReports.push({
        name: category,
        score: Math.round(categoryScore),
        status: categoryStatus,
        rules: ruleReports,
        weight: this.standards.getCategoryWeights().get(category) || 10
      });
    }

    // Calcular score general ponderado
    const weights = this.standards.getCategoryWeights();
    const totalWeight = categoriesToValidate.reduce((sum, cat) => sum + (weights.get(cat) || 10), 0);
    const overallScore = Math.round(
      categoryReports.reduce((sum, report) => 
        sum + (report.score * (weights.get(report.name) || 10)), 0
      ) / totalWeight
    );

    const thresholds = this.standards.getScoreThresholds();
    const overallStatus = overallScore >= thresholds.passed ? 'PASSED' :
                         overallScore >= thresholds.warning ? 'WARNING' : 'FAILED';

    // Generar recomendaciones
    const recommendations = this.generateRecommendations(categoryReports);

    // Generar summary
    const summary = this.generateValidationSummary(categoryReports);

    const executionTime = Date.now() - startTime;

    const report: JavaValidationReport = {
      project: javaProject,
      timestamp: new Date().toISOString(),
      overallScore,
      overallStatus,
      categories: categoryReports,
      recommendations,
      summary,
      executionTime
    };

    console.error(`[JavaValidator] Validación completada en ${executionTime}ms - Score: ${overallScore}/100 (${overallStatus})`);

    return {
      content: [
        {
          type: 'text',
          text: this.formatValidationReport(report, includeDetails)
        }
      ]
    };
  }

  private async getJavaStandards(args: any) {
    const { category } = args;

    const allRules = this.standards.getAllRules();
    const weights = this.standards.getCategoryWeights();
    const thresholds = this.standards.getScoreThresholds();

    if (category) {
      const categoryRules = allRules.get(category as ValidationCategory) || [];
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              category,
              weight: weights.get(category as ValidationCategory),
              rules: categoryRules.map(rule => ({
                id: rule.id,
                name: rule.name,
                description: rule.description,
                severity: rule.severity
              }))
            }, null, 2)
          }
        ]
      };
    }

    // Retornar todos los estándares
    const standardsInfo: any = {
      thresholds,
      categories: {}
    };

    for (const [categoryName, rules] of allRules.entries()) {
      standardsInfo.categories[categoryName] = {
        weight: weights.get(categoryName),
        rulesCount: rules.length,
        rules: rules.map(rule => ({
          id: rule.id,
          name: rule.name,
          description: rule.description,
          severity: rule.severity
        }))
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(standardsInfo, null, 2)
        }
      ]
    };
  }

  private async analyzeJavaProject(args: any) {
    const { projectPath } = args;

    if (!projectPath) {
      throw new McpError(ErrorCode.InvalidParams, 'projectPath es requerido');
    }

    try {
      const javaProject = await this.parseJavaProject(projectPath);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(javaProject, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Error analizando proyecto: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async parseJavaProject(projectPath: string): Promise<JavaProject> {
    const projectName = path.basename(projectPath);
    
    // Detectar build tool
    const buildTool = await this.detectBuildTool(projectPath);
    
    // Parse project info según build tool
    const projectInfo = buildTool === 'maven' 
      ? await this.parseMavenProject(projectPath)
      : await this.parseGradleProject(projectPath);

    // Detectar framework Java
    const framework = this.detectJavaFramework(projectInfo);
    
    // Detectar versión Java
    const javaVersion = this.detectJavaVersion(projectInfo);
    
    // Detectar versión Spring Boot
    const springBootVersion = this.detectSpringBootVersion(projectInfo);

    return {
      name: projectName,
      path: projectPath,
      buildTool,
      projectInfo,
      framework,
      javaVersion,
      springBootVersion
    };
  }

  private async detectBuildTool(projectPath: string): Promise<'maven' | 'gradle' | 'unknown'> {
    try {
      await fs.access(path.join(projectPath, 'pom.xml'));
      return 'maven';
    } catch {
      try {
        await fs.access(path.join(projectPath, 'build.gradle'));
        return 'gradle';
      } catch {
        try {
          await fs.access(path.join(projectPath, 'build.gradle.kts'));
          return 'gradle';
        } catch {
          return 'unknown';
        }
      }
    }
  }

  private async parseMavenProject(projectPath: string) {
    const pomPath = path.join(projectPath, 'pom.xml');
    const pomContent = await fs.readFile(pomPath, 'utf-8');
    
    return new Promise<any>((resolve, reject) => {
      parseXML(pomContent, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const project = result.project;
        const dependencies = project.dependencies?.[0]?.dependency?.map((dep: any) => ({
          groupId: dep.groupId?.[0] || '',
          artifactId: dep.artifactId?.[0] || '',
          version: dep.version?.[0],
          scope: dep.scope?.[0]
        })) || [];

        const plugins = project.build?.[0]?.plugins?.[0]?.plugin?.map((plugin: any) => ({
          groupId: plugin.groupId?.[0] || '',
          artifactId: plugin.artifactId?.[0] || '',
          version: plugin.version?.[0]
        })) || [];

        const properties: Record<string, string> = {};
        if (project.properties?.[0]) {
          Object.keys(project.properties[0]).forEach(key => {
            if (key !== '$') {
              properties[key] = project.properties[0][key][0];
            }
          });
        }

        resolve({
          groupId: project.groupId?.[0] || project.parent?.[0]?.groupId?.[0] || '',
          artifactId: project.artifactId?.[0] || '',
          version: project.version?.[0] || project.parent?.[0]?.version?.[0] || '',
          description: project.description?.[0],
          dependencies,
          plugins,
          properties
        });
      });
    });
  }

  private async parseGradleProject(projectPath: string) {
    // Implementación simplificada para Gradle
    const buildGradlePath = path.join(projectPath, 'build.gradle');
    
    try {
      const buildContent = await fs.readFile(buildGradlePath, 'utf-8');
      
      // Parsing básico de dependencies (muy simplificado)
      const dependencies: any[] = [];
      const plugins: any[] = [];
      
      // Extraer algunas dependencias básicas
      const depMatches = buildContent.match(/implementation\s+['"]([^'"]+)['"]/g) || [];
      depMatches.forEach(match => {
        const dep = match.replace(/implementation\s+['"]([^'"]+)['"]/, '$1');
        const [groupId, artifactId, version] = dep.split(':');
        dependencies.push({
          groupId: groupId || '',
          artifactId: artifactId || '',
          version,
          scope: 'compile'
        });
      });

      return {
        groupId: 'com.example', // Default
        artifactId: path.basename(projectPath),
        version: '1.0.0', // Default
        dependencies,
        plugins,
        properties: {}
      };
    } catch {
      return {
        groupId: 'unknown',
        artifactId: path.basename(projectPath),
        version: '1.0.0',
        dependencies: [],
        plugins: [],
        properties: {}
      };
    }
  }

  private detectJavaFramework(projectInfo: any): JavaProject['framework'] {
    const dependencies = projectInfo.dependencies || [];
    
    if (dependencies.some((dep: any) => dep.artifactId === 'spring-boot-starter')) {
      return 'spring-boot';
    }
    
    if (dependencies.some((dep: any) => dep.groupId === 'org.springframework')) {
      return 'spring';
    }
    
    if (dependencies.some((dep: any) => dep.groupId === 'io.quarkus')) {
      return 'quarkus';
    }
    
    if (dependencies.some((dep: any) => dep.groupId === 'io.micronaut')) {
      return 'micronaut';
    }
    
    return 'vanilla';
  }

  private detectJavaVersion(projectInfo: any): string {
    const properties = projectInfo.properties || {};
    
    return properties['java.version'] || 
           properties['maven.compiler.source'] || 
           properties['maven.compiler.target'] || 
           '17'; // Default moderno
  }

  private detectSpringBootVersion(projectInfo: any): string | undefined {
    const dependencies = projectInfo.dependencies || [];
    
    const springBootDep = dependencies.find((dep: any) => 
      dep.groupId === 'org.springframework.boot'
    );
    
    return springBootDep?.version || projectInfo.properties?.['spring-boot.version'];
  }

  private generateRecommendations(categoryReports: CategoryReport[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    for (const categoryReport of categoryReports) {
      if (categoryReport.status === 'FAILED') {
        recommendations.push({
          priority: 'HIGH',
          category: categoryReport.name,
          title: `Mejorar ${categoryReport.name}`,
          description: `Categoría ${categoryReport.name} tiene score bajo: ${categoryReport.score}/100`,
          action: 'Revisar y corregir las reglas fallidas en esta categoría',
          impact: 'Alto impacto en calidad general del código',
          effort: categoryReport.rules.length > 5 ? 'High' : 'Medium'
        });
      } else if (categoryReport.status === 'WARNING') {
        recommendations.push({
          priority: 'MEDIUM',
          category: categoryReport.name,
          title: `Optimizar ${categoryReport.name}`,
          description: `Categoría ${categoryReport.name} puede mejorarse: ${categoryReport.score}/100`,
          action: 'Implementar sugerencias de las reglas con warnings',
          impact: 'Mejora la mantenibilidad y robustez',
          effort: 'Medium'
        });
      }
    }

    return recommendations.slice(0, 5); // Top 5 recomendaciones
  }

  private generateValidationSummary(categoryReports: CategoryReport[]): ValidationSummary {
    let totalRules = 0;
    let passedRules = 0;
    let failedRules = 0;
    let warningRules = 0;
    let skippedRules = 0;
    let securityIssues = 0;
    let performanceIssues = 0;
    let codeSmells = 0;

    for (const categoryReport of categoryReports) {
      for (const ruleReport of categoryReport.rules) {
        totalRules++;
        
        switch (ruleReport.result.status) {
          case 'PASSED':
            passedRules++;
            break;
          case 'FAILED':
            failedRules++;
            if (categoryReport.name === 'security') securityIssues++;
            if (categoryReport.name === 'performance') performanceIssues++;
            if (categoryReport.name === 'codeQuality') codeSmells++;
            break;
          case 'SKIPPED':
            skippedRules++;
            break;
        }
        
        if (ruleReport.result.status === 'WARNING') {
          warningRules++;
        }
      }
    }

    return {
      totalRules,
      passedRules,
      failedRules,
      warningRules,
      skippedRules,
      securityIssues,
      performanceIssues,
      codeSmells,
      testClasses: 0 // Se podría implementar conteo real
    };
  }

  private formatValidationReport(report: JavaValidationReport, includeDetails: boolean): string {
    let output = `# Reporte de Validación Java - ${report.project.name}\n\n`;
    
    output += `**Proyecto:** ${report.project.name}\n`;
    output += `**Framework:** ${report.project.framework}\n`;
    output += `**Java Version:** ${report.project.javaVersion}\n`;
    output += `**Build Tool:** ${report.project.buildTool}\n`;
    output += `**Timestamp:** ${report.timestamp}\n`;
    output += `**Tiempo de Ejecución:** ${report.executionTime}ms\n\n`;

    // Score general
    output += `## 📊 Score General: ${report.overallScore}/100 (${report.overallStatus})\n\n`;

    // Resumen por categorías
    output += `## 📋 Resumen por Categorías\n\n`;
    for (const category of report.categories) {
      const emoji = category.status === 'PASSED' ? '✅' : 
                   category.status === 'WARNING' ? '⚠️' : '❌';
      output += `${emoji} **${category.name}**: ${category.score}/100 (${category.rules.length} reglas)\n`;
    }
    output += '\n';

    // Detalles por categoría
    if (includeDetails) {
      for (const category of report.categories) {
        output += `### ${category.name} (${category.score}/100)\n\n`;
        
        for (const ruleReport of category.rules) {
          const emoji = ruleReport.result.status === 'PASSED' ? '✅' : 
                       ruleReport.result.status === 'WARNING' ? '⚠️' : 
                       ruleReport.result.status === 'SKIPPED' ? '⏭️' : '❌';
          
          output += `${emoji} **${ruleReport.rule.name}** (${ruleReport.result.score}/100)\n`;
          if (ruleReport.result.message) {
            output += `   ${ruleReport.result.message}\n`;
          }
          
          if (ruleReport.result.suggestions && ruleReport.result.suggestions.length > 0) {
            output += `   💡 Sugerencias:\n`;
            for (const suggestion of ruleReport.result.suggestions) {
              output += `      - ${suggestion}\n`;
            }
          }
          output += '\n';
        }
      }
    }

    // Recomendaciones
    if (report.recommendations.length > 0) {
      output += `## 🎯 Recomendaciones Principales\n\n`;
      for (const rec of report.recommendations) {
        const priorityEmoji = rec.priority === 'HIGH' ? '🔴' : 
                             rec.priority === 'MEDIUM' ? '🟡' : '🟢';
        output += `${priorityEmoji} **${rec.title}** (${rec.priority})\n`;
        output += `   ${rec.description}\n`;
        output += `   **Acción:** ${rec.action}\n`;
        output += `   **Esfuerzo:** ${rec.effort}\n\n`;
      }
    }

    // Summary estadístico
    output += `## 📈 Estadísticas\n\n`;
    output += `- **Total de reglas:** ${report.summary.totalRules}\n`;
    output += `- **Reglas pasadas:** ${report.summary.passedRules}\n`;
    output += `- **Reglas fallidas:** ${report.summary.failedRules}\n`;
    output += `- **Reglas omitidas:** ${report.summary.skippedRules}\n`;
    output += `- **Issues de seguridad:** ${report.summary.securityIssues}\n`;
    output += `- **Issues de performance:** ${report.summary.performanceIssues}\n`;
    output += `- **Code smells:** ${report.summary.codeSmells}\n`;

    return output;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Java Standards Validator MCP Server ejecutándose en stdio');
  }
}

const server = new JavaStandardsValidatorServer();
server.run().catch(console.error);