/**
 * Technology Selector - Interactive CLI for technology selection
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  TechnologyAnalysis,
  TechnologyComparison,
  TechnologyOption,
  TechnologyRecommendation,
  UserChoice,
  TechnologyType,
  MicroserviceSpecification,
  RepositoryAnalysisResult
} from '../types/index.js';

export class TechnologySelector {
  async presentOptions(analysis: TechnologyAnalysis): Promise<UserChoice> {
    console.clear();
    
    // Display analysis header
    this.displayAnalysisHeader(analysis.specification);
    
    // Display repository analysis
    this.displayRepositoryAnalysis(analysis.repositoryAnalysis);
    
    // Generate and display technology comparison
    const comparison = this.generateTechnologyComparison(analysis);
    this.displayTechnologyComparison(comparison);
    
    // Present interactive selection
    const choice = await this.getInteractiveChoice(comparison);
    
    return {
      technology: choice.technology,
      confirmed: choice.confirmed,
      timestamp: new Date(),
      reason: choice.reason
    };
  }

  async generateRecommendation(
    specification: MicroserviceSpecification,
    repositoryAnalysis: { nodejs: RepositoryAnalysisResult; springboot: RepositoryAnalysisResult }
  ): Promise<TechnologyRecommendation> {
    let nodejsScore = 70;
    let springbootScore = 70;
    const nodejsReasons: string[] = [];
    const springbootReasons: string[] = [];
    const nodejsRisks: string[] = [];
    const springbootRisks: string[] = [];

    // Database analysis
    if (specification.database.type === 'oracle') {
      springbootScore += 15;
      springbootReasons.push('Excellent Oracle support with Spring Data JPA');
      nodejsRisks.push('Oracle driver complexity');
    }

    // Stored procedures
    if (specification.database.procedures && specification.database.procedures.length > 0) {
      springbootScore += 10;
      springbootReasons.push('Native stored procedure support');
      nodejsRisks.push('Limited stored procedure tooling');
    }

    // Security requirements
    if (specification.security.requirements.length > 0) {
      springbootScore += 8;
      springbootReasons.push('Enterprise security patterns');
      nodejsRisks.push('Manual security setup');
    }

    // Repository availability
    const nodejsRepoBonus = Math.min(10, repositoryAnalysis.nodejs.repositories.length * 2);
    const springbootRepoBonus = Math.min(10, repositoryAnalysis.springboot.repositories.length * 2);
    
    nodejsScore += nodejsRepoBonus;
    springbootScore += springbootRepoBonus;

    if (repositoryAnalysis.nodejs.repositories.length > 0) {
      nodejsReasons.push(`${repositoryAnalysis.nodejs.repositories.length} reference repositories available`);
    }
    
    if (repositoryAnalysis.springboot.repositories.length > 0) {
      springbootReasons.push(`${repositoryAnalysis.springboot.repositories.length} reference repositories available`);
    }

    // Compatibility scores
    nodejsScore += repositoryAnalysis.nodejs.averageCompatibility * 0.2;
    springbootScore += repositoryAnalysis.springboot.averageCompatibility * 0.2;

    // Determine recommended technology
    const recommended: TechnologyType = springbootScore > nodejsScore ? 'springboot' : 'nodejs';
    const confidence = Math.abs(springbootScore - nodejsScore) / Math.max(springbootScore, nodejsScore) * 100;

    const allReasons = recommended === 'springboot' ? springbootReasons : nodejsReasons;

    return {
      technology: recommended,
      score: Math.max(springbootScore, nodejsScore),
      confidence: Math.round(confidence),
      reasoning: allReasons,
      estimatedEffort: this.calculateEstimatedEffort(Math.max(springbootScore, nodejsScore)),
      developmentTime: this.calculateDevelopmentTime(recommended, specification),
      riskFactors: recommended === 'springboot' ? springbootRisks : nodejsRisks
    };
  }

  private displayAnalysisHeader(specification: MicroserviceSpecification): void {
    console.log(chalk.cyan('📋 ANÁLISIS DE ESPECIFICACIÓN COMPLETADO'));
    console.log(chalk.cyan('━'.repeat(60)));
    console.log();
    
    console.log(chalk.bold('📊 Resumen del Microservicio:'));
    console.log(`   ${chalk.green('•')} Nombre: ${chalk.white(specification.name)}`);
    console.log(`   ${chalk.green('•')} Endpoints: ${chalk.white(specification.endpoints.length)}`);
    console.log(`   ${chalk.green('•')} Base de datos: ${chalk.white(specification.database.type.toUpperCase())}`);
    console.log(`   ${chalk.green('•')} Integraciones: ${chalk.white(specification.integrations.length)}`);
    console.log(`   ${chalk.green('•')} Complejidad: ${chalk.white(specification.complexity || 'Media')}`);
    console.log();
  }

  private displayRepositoryAnalysis(repositoryAnalysis: { nodejs: RepositoryAnalysisResult; springboot: RepositoryAnalysisResult }): void {
    console.log(chalk.bold('🔍 Repositorios de Referencia Encontrados:'));
    console.log();

    // Node.js repositories
    console.log(chalk.green(`   Node.js (${repositoryAnalysis.nodejs.repositories.length} repositorios):`));
    if (repositoryAnalysis.nodejs.repositories.length > 0) {
      repositoryAnalysis.nodejs.repositories
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, 3)
        .forEach(repo => {
          console.log(`   ${chalk.green('✅')} ${repo.name} (Compatibilidad: ${repo.compatibility}%)`);
        });
    } else {
      console.log(`   ${chalk.red('❌')} No se encontraron repositorios Node.js`);
    }
    console.log();

    // Spring Boot repositories
    console.log(chalk.blue(`   Spring Boot (${repositoryAnalysis.springboot.repositories.length} repositorios):`));
    if (repositoryAnalysis.springboot.repositories.length > 0) {
      repositoryAnalysis.springboot.repositories
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, 3)
        .forEach(repo => {
          console.log(`   ${chalk.green('✅')} ${repo.name} (Compatibilidad: ${repo.compatibility}%)`);
        });
    } else {
      console.log(`   ${chalk.red('❌')} No se encontraron repositorios Spring Boot`);
    }
    console.log();
    console.log(chalk.cyan('━'.repeat(60)));
    console.log();
  }

  private generateTechnologyComparison(analysis: TechnologyAnalysis): TechnologyComparison {
    const nodejsOption = this.generateTechnologyOption('nodejs', analysis);
    const springbootOption = this.generateTechnologyOption('springboot', analysis);
    
    const recommendation = this.generateRecommendationFromAnalysis(analysis);

    return {
      nodejs: nodejsOption,
      springboot: springbootOption,
      recommendation
    };
  }

  private generateTechnologyOption(technology: TechnologyType, analysis: TechnologyAnalysis): TechnologyOption {
    const repoAnalysis = technology === 'nodejs' 
      ? analysis.repositoryAnalysis.nodejs 
      : analysis.repositoryAnalysis.springboot;

    const strengths = this.getTechnologyStrengths(technology, analysis.specification);
    const weaknesses = this.getTechnologyWeaknesses(technology, analysis.specification);
    const bestFor = this.getTechnologyBestFor(technology);
    
    return {
      technology,
      compatibilityScore: repoAnalysis.averageCompatibility,
      strengths,
      weaknesses,
      bestFor,
      estimatedEffort: this.calculateEstimatedEffort(repoAnalysis.averageCompatibility),
      developmentTime: this.calculateDevelopmentTime(technology, analysis.specification),
      repositoriesAvailable: repoAnalysis.repositories.length,
      metrics: {
        filesGenerated: technology === 'nodejs' ? 52 : 68,
        compatibilityPercentage: repoAnalysis.averageCompatibility,
        complexityScore: this.calculateComplexityScore(technology, analysis.specification),
        maintenanceScore: technology === 'springboot' ? 85 : 75
      }
    };
  }

  private generateRecommendationFromAnalysis(analysis: TechnologyAnalysis): TechnologyRecommendation {
    const nodejsScore = this.calculateTechnologyScore('nodejs', analysis);
    const springbootScore = this.calculateTechnologyScore('springboot', analysis);
    
    const recommended: TechnologyType = springbootScore > nodejsScore ? 'springboot' : 'nodejs';
    const score = Math.max(nodejsScore, springbootScore);
    const confidence = Math.abs(springbootScore - nodejsScore) / Math.max(springbootScore, nodejsScore) * 100;

    return {
      technology: recommended,
      score,
      confidence: Math.round(confidence),
      reasoning: this.getRecommendationReasons(recommended, analysis),
      estimatedEffort: this.calculateEstimatedEffort(score),
      developmentTime: this.calculateDevelopmentTime(recommended, analysis.specification),
      riskFactors: this.getRiskFactors(recommended, analysis.specification)
    };
  }

  private displayTechnologyComparison(comparison: TechnologyComparison): void {
    console.log(chalk.bold('🚀 SELECCIONA LA TECNOLOGÍA PARA TU MICROSERVICIO'));
    console.log(chalk.cyan('━'.repeat(62)));
    console.log();

    // Node.js option
    this.displayTechnologyOption('🟢 OPCIÓN 1: NODE.JS + TYPESCRIPT', comparison.nodejs, 'green');
    console.log();

    // Spring Boot option
    this.displayTechnologyOption('☕ OPCIÓN 2: SPRING BOOT + JAVA', comparison.springboot, 'blue');
    console.log();

    // Recommendation
    console.log(chalk.bold(`🎯 RECOMENDACIÓN AUTOMÁTICA: ${comparison.recommendation.technology === 'springboot' ? 'Spring Boot' : 'Node.js'}`));
    console.log(`   Basado en: ${comparison.recommendation.reasoning.slice(0, 2).join(' + ')}`);
    console.log();
    console.log(chalk.cyan('━'.repeat(62)));
    console.log();
  }

  private displayTechnologyOption(title: string, option: TechnologyOption, color: 'green' | 'blue'): void {
    const colorFn = color === 'green' ? chalk.green : chalk.blue;
    const boxTop = '┌─────────────────────────────────────────────────────────────┐';
    const boxBottom = '└─────────────────────────────────────────────────────────────┘';
    const boxSide = '│';

    console.log(boxTop);
    console.log(`${boxSide}  ${colorFn(title.padEnd(57))} ${boxSide}`);
    console.log(`${boxSide}${' '.repeat(61)}${boxSide}`);
    
    console.log(`${boxSide}  ${chalk.green('✅ Ventajas para tu caso:')}${' '.repeat(32)}${boxSide}`);
    option.strengths.slice(0, 4).forEach(strength => {
      const text = `     • ${strength}`;
      console.log(`${boxSide}  ${text.padEnd(59)}${boxSide}`);
    });
    console.log(`${boxSide}${' '.repeat(61)}${boxSide}`);
    
    console.log(`${boxSide}  ${chalk.yellow('⚠️  Consideraciones:')}${' '.repeat(35)}${boxSide}`);
    option.weaknesses.slice(0, 2).forEach(weakness => {
      const text = `     • ${weakness}`;
      console.log(`${boxSide}  ${text.padEnd(59)}${boxSide}`);
    });
    console.log(`${boxSide}${' '.repeat(61)}${boxSide}`);
    
    console.log(`${boxSide}  ${chalk.cyan('📊 Métricas:')}${' '.repeat(44)}${boxSide}`);
    console.log(`${boxSide}     • Tiempo estimado: ${option.developmentTime.padEnd(34)}${boxSide}`);
    console.log(`${boxSide}     • Archivos generados: ~${option.metrics.filesGenerated.toString().padEnd(30)}${boxSide}`);
    console.log(`${boxSide}     • Repos de referencia: ${option.repositoriesAvailable} disponibles${' '.repeat(20)}${boxSide}`);
    console.log(`${boxSide}     • Compatibilidad: ${option.compatibilityScore}%${' '.repeat(32)}${boxSide}`);
    console.log(boxBottom);
  }

  private async getInteractiveChoice(comparison: TechnologyComparison): Promise<{
    technology: TechnologyType;
    confirmed: boolean;
    reason?: string;
  }> {
    const choices = [
      {
        name: 'Node.js + TypeScript',
        value: 'nodejs',
        short: 'Node.js'
      },
      {
        name: 'Spring Boot + Java',
        value: 'springboot',
        short: 'Spring Boot'
      },
      {
        name: 'Ver comparación detallada',
        value: 'compare',
        short: 'Comparar'
      },
      {
        name: 'Cancelar',
        value: 'cancel',
        short: 'Cancelar'
      }
    ];

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Selecciona una opción:',
        choices,
        default: comparison.recommendation.technology
      }
    ]);

    if (answers.choice === 'compare') {
      this.renderComparisonTable(comparison);
      return this.getInteractiveChoice(comparison); // Recursive call
    }

    if (answers.choice === 'cancel') {
      return {
        technology: 'nodejs' as TechnologyType,
        confirmed: false
      };
    }

    // Confirmation
    const confirmation = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `¿Confirmas la selección de ${answers.choice === 'nodejs' ? 'Node.js + TypeScript' : 'Spring Boot + Java'}?`,
        default: true
      }
    ]);

    return {
      technology: answers.choice as TechnologyType,
      confirmed: confirmation.confirmed,
      reason: `Usuario seleccionó ${answers.choice === 'nodejs' ? 'Node.js' : 'Spring Boot'}`
    };
  }

  renderComparisonTable(comparison: TechnologyComparison): string {
    console.clear();
    console.log(chalk.bold('📊 COMPARACIÓN DETALLADA DE TECNOLOGÍAS'));
    console.log(chalk.cyan('━'.repeat(80)));
    console.log();

    const table = [
      ['Criterio', 'Node.js + TypeScript', 'Spring Boot + Java'],
      ['━'.repeat(20), '━'.repeat(25), '━'.repeat(25)],
      ['Compatibilidad', `${comparison.nodejs.compatibilityScore}%`, `${comparison.springboot.compatibilityScore}%`],
      ['Tiempo desarrollo', comparison.nodejs.developmentTime, comparison.springboot.developmentTime],
      ['Archivos generados', `~${comparison.nodejs.metrics.filesGenerated}`, `~${comparison.springboot.metrics.filesGenerated}`],
      ['Repos disponibles', comparison.nodejs.repositoriesAvailable.toString(), comparison.springboot.repositoriesAvailable.toString()],
      ['Mantenimiento', `${comparison.nodejs.metrics.maintenanceScore}%`, `${comparison.springboot.metrics.maintenanceScore}%`]
    ];

    table.forEach((row, index) => {
      if (index === 0) {
        console.log(chalk.bold(row.join(' │ ').padEnd(80)));
      } else if (index === 1) {
        console.log(row.join('┼').padEnd(80));
      } else {
        console.log(row.join(' │ ').padEnd(80));
      }
    });

    console.log();
    console.log(chalk.bold('Fortalezas principales:'));
    console.log(chalk.green('Node.js:'), comparison.nodejs.strengths.slice(0, 3).join(', '));
    console.log(chalk.blue('Spring Boot:'), comparison.springboot.strengths.slice(0, 3).join(', '));
    console.log();

    console.log('Presiona Enter para volver al menú de selección...');
    process.stdin.once('data', () => {
      console.clear();
      this.displayTechnologyComparison(comparison);
    });

    return 'Comparison table displayed';
  }

  // Helper methods
  private getTechnologyStrengths(technology: TechnologyType, spec: MicroserviceSpecification): string[] {
    if (technology === 'nodejs') {
      return [
        'Desarrollo rápido y ágil',
        'Excelente soporte para APIs REST',
        'Ecosistema npm rico para integraciones',
        'Menor uso de memoria',
        'Desarrollo orientado a eventos'
      ];
    } else {
      return [
        'Excelente soporte nativo para Oracle',
        'Frameworks empresariales maduros',
        'Spring Data JPA simplifica persistencia',
        'Mejor para sistemas de alta concurrencia',
        'Robustez y estabilidad empresarial'
      ];
    }
  }

  private getTechnologyWeaknesses(technology: TechnologyType, spec: MicroserviceSpecification): string[] {
    if (technology === 'nodejs') {
      return [
        'Requiere configuración manual para Oracle',
        'Menos soporte empresarial nativo',
        'Gestión de tipos más compleja'
      ];
    } else {
      return [
        'Mayor tiempo de desarrollo inicial',
        'Mayor uso de memoria',
        'Curva de aprendizaje más pronunciada'
      ];
    }
  }

  private getTechnologyBestFor(technology: TechnologyType): string[] {
    if (technology === 'nodejs') {
      return [
        'Rapid prototyping',
        'Simple REST APIs',
        'Event-driven architectures',
        'Microservices ligeros'
      ];
    } else {
      return [
        'Enterprise applications',
        'Database-heavy services',
        'Complex business logic',
        'High-performance systems'
      ];
    }
  }

  private calculateTechnologyScore(technology: TechnologyType, analysis: TechnologyAnalysis): number {
    const repoAnalysis = technology === 'nodejs' 
      ? analysis.repositoryAnalysis.nodejs 
      : analysis.repositoryAnalysis.springboot;

    let score = repoAnalysis.averageCompatibility;
    
    // Add database compatibility bonus
    if (analysis.specification.database.type === 'oracle' && technology === 'springboot') {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  private getRecommendationReasons(technology: TechnologyType, analysis: TechnologyAnalysis): string[] {
    const reasons: string[] = [];
    
    if (technology === 'springboot') {
      reasons.push('Oracle database is primary requirement');
      reasons.push('Enterprise integration patterns needed');
      reasons.push('Security requirements align with Spring Security');
    } else {
      reasons.push('Lightweight microservice approach');
      reasons.push('Rapid development cycles preferred');
      reasons.push('Simple REST API requirements');
    }
    
    return reasons;
  }

  private getRiskFactors(technology: TechnologyType, spec: MicroserviceSpecification): string[] {
    if (technology === 'nodejs') {
      return ['Oracle driver complexity', 'Manual security setup'];
    } else {
      return ['Higher resource usage', 'Steeper learning curve'];
    }
  }

  private calculateEstimatedEffort(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  }

  private calculateDevelopmentTime(technology: TechnologyType, spec: MicroserviceSpecification): string {
    const baseTime = technology === 'nodejs' ? 15 : 20;
    const complexity = spec.complexity === 'high' ? 1.5 : spec.complexity === 'low' ? 0.8 : 1;
    const time = Math.round(baseTime * complexity);
    
    return `${time}-${time + 5} minutos`;
  }

  private calculateComplexityScore(technology: TechnologyType, spec: MicroserviceSpecification): number {
    let score = 50;
    
    score += spec.endpoints.length * 2;
    score += spec.integrations.length * 5;
    if (spec.database.procedures) {
      score += spec.database.procedures.length * 3;
    }
    
    return Math.min(100, score);
  }
}
