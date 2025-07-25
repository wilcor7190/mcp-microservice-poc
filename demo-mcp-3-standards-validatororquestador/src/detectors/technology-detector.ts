import { promises as fs } from 'fs';
import path from 'path';
import { TechnologyDetectionResult, TechnologyIndicator, TechnologyType } from '../types/index.js';

export class TechnologyDetector {
  
  private readonly technologyIndicators = {
    nodejs: [
      { type: 'file' as const, name: 'package.json', weight: 10, found: false },
      { type: 'file' as const, name: 'yarn.lock', weight: 5, found: false },
      { type: 'file' as const, name: 'package-lock.json', weight: 5, found: false },
      { type: 'file' as const, name: 'nest-cli.json', weight: 8, found: false },
      { type: 'file' as const, name: 'tsconfig.json', weight: 6, found: false },
      { type: 'file' as const, name: '.eslintrc.js', weight: 4, found: false },
      { type: 'structure' as const, name: 'src/main.ts', weight: 7, found: false },
      { type: 'structure' as const, name: 'src/app.module.ts', weight: 8, found: false },
      { type: 'structure' as const, name: 'test/', weight: 3, found: false },
      { type: 'dependency' as const, name: '@nestjs/core', weight: 9, found: false },
      { type: 'dependency' as const, name: 'express', weight: 6, found: false },
      { type: 'dependency' as const, name: 'fastify', weight: 6, found: false }
    ],
    java: [
      { type: 'file' as const, name: 'pom.xml', weight: 10, found: false },
      { type: 'file' as const, name: 'build.gradle', weight: 10, found: false },
      { type: 'file' as const, name: 'gradlew', weight: 5, found: false },
      { type: 'file' as const, name: 'mvnw', weight: 5, found: false },
      { type: 'structure' as const, name: 'src/main/java', weight: 9, found: false },
      { type: 'structure' as const, name: 'src/test/java', weight: 6, found: false },
      { type: 'structure' as const, name: 'src/main/resources', weight: 5, found: false },
      { type: 'dependency' as const, name: 'spring-boot-starter', weight: 9, found: false },
      { type: 'dependency' as const, name: 'spring-boot-starter-web', weight: 8, found: false },
      { type: 'dependency' as const, name: 'junit', weight: 5, found: false },
      { type: 'content' as const, name: '@SpringBootApplication', weight: 10, found: false },
      { type: 'content' as const, name: '@RestController', weight: 7, found: false }
    ],
    dotnet: [
      { type: 'file' as const, name: '*.csproj', weight: 10, found: false },
      { type: 'file' as const, name: '*.sln', weight: 8, found: false },
      { type: 'file' as const, name: 'appsettings.json', weight: 6, found: false },
      { type: 'file' as const, name: 'Program.cs', weight: 8, found: false },
      { type: 'file' as const, name: 'Startup.cs', weight: 7, found: false },
      { type: 'structure' as const, name: 'Controllers/', weight: 6, found: false },
      { type: 'structure' as const, name: 'Models/', weight: 4, found: false },
      { type: 'dependency' as const, name: 'Microsoft.AspNetCore', weight: 9, found: false },
      { type: 'content' as const, name: '[ApiController]', weight: 8, found: false },
      { type: 'content' as const, name: 'using Microsoft.AspNetCore', weight: 7, found: false }
    ]
  };

  async detectTechnology(projectPath: string): Promise<TechnologyDetectionResult> {
    console.error(`[TechnologyDetector] Detectando tecnología en: ${projectPath}`);
    
    const results: { [key in TechnologyType]?: { score: number; indicators: TechnologyIndicator[] } } = {};
    
    // Analizar cada tecnología
    for (const [tech, indicators] of Object.entries(this.technologyIndicators)) {
      const techResults = await this.analyzeTechnology(projectPath, tech as TechnologyType, indicators);
      results[tech as TechnologyType] = techResults;
    }
    
    // Determinar la tecnología más probable
    const bestMatch = this.getBestMatch(results);
    
    console.error(`[TechnologyDetector] Tecnología detectada: ${bestMatch.technology} (${bestMatch.confidence}%)`);
    
    return bestMatch;
  }
  
  private async analyzeTechnology(
    projectPath: string, 
    technology: TechnologyType, 
    indicators: TechnologyIndicator[]
  ): Promise<{ score: number; indicators: TechnologyIndicator[] }> {
    
    const results: TechnologyIndicator[] = indicators.map(indicator => ({ ...indicator }));
    let totalScore = 0;
    let maxScore = 0;
    
    for (const indicator of results) {
      maxScore += indicator.weight;
      
      try {
        switch (indicator.type) {
          case 'file':
            indicator.found = await this.checkFile(projectPath, indicator.name);
            break;
          case 'structure':
            indicator.found = await this.checkStructure(projectPath, indicator.name);
            break;
          case 'dependency':
            indicator.found = await this.checkDependency(projectPath, indicator.name, technology);
            break;
          case 'content':
            indicator.found = await this.checkContent(projectPath, indicator.name, technology);
            break;
        }
        
        if (indicator.found) {
          totalScore += indicator.weight;
        }
      } catch (error) {
        console.error(`[TechnologyDetector] Error verificando ${indicator.name}:`, error);
        indicator.found = false;
      }
    }
    
    const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    return { score, indicators: results };
  }
  
  private async checkFile(projectPath: string, fileName: string): Promise<boolean> {
    try {
      if (fileName.includes('*')) {
        // Buscar archivos con patrón (ej: *.csproj)
        const files = await fs.readdir(projectPath);
        const pattern = fileName.replace('*', '').replace('.', '\\.');
        const regex = new RegExp(`.*${pattern}$`, 'i');
        return files.some(file => regex.test(file));
      } else {
        // Buscar archivo específico
        const filePath = path.join(projectPath, fileName);
        await fs.access(filePath);
        return true;
      }
    } catch {
      return false;
    }
  }
  
  private async checkStructure(projectPath: string, structurePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(projectPath, structurePath);
      const stat = await fs.stat(fullPath);
      return stat.isDirectory() || stat.isFile();
    } catch {
      return false;
    }
  }
  
  private async checkDependency(projectPath: string, dependencyName: string, technology: TechnologyType): Promise<boolean> {
    try {
      switch (technology) {
        case 'nodejs':
          return await this.checkNodeJSDependency(projectPath, dependencyName);
        case 'java':
          return await this.checkJavaDependency(projectPath, dependencyName);
        case 'dotnet':
          return await this.checkDotNetDependency(projectPath, dependencyName);
        default:
          return false;
      }
    } catch {
      return false;
    }
  }
  
  private async checkNodeJSDependency(projectPath: string, dependencyName: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      
      return !!(
        packageJson.dependencies?.[dependencyName] ||
        packageJson.devDependencies?.[dependencyName] ||
        packageJson.peerDependencies?.[dependencyName]
      );
    } catch {
      return false;
    }
  }
  
  private async checkJavaDependency(projectPath: string, dependencyName: string): Promise<boolean> {
    try {
      // Verificar en pom.xml
      const pomPath = path.join(projectPath, 'pom.xml');
      if (await this.fileExists(pomPath)) {
        const pomContent = await fs.readFile(pomPath, 'utf-8');
        if (pomContent.includes(dependencyName)) {
          return true;
        }
      }
      
      // Verificar en build.gradle
      const gradlePaths = [
        path.join(projectPath, 'build.gradle'),
        path.join(projectPath, 'build.gradle.kts')
      ];
      
      for (const gradlePath of gradlePaths) {
        if (await this.fileExists(gradlePath)) {
          const gradleContent = await fs.readFile(gradlePath, 'utf-8');
          if (gradleContent.includes(dependencyName)) {
            return true;
          }
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }
  
  private async checkDotNetDependency(projectPath: string, dependencyName: string): Promise<boolean> {
    try {
      const files = await fs.readdir(projectPath);
      const csprojFiles = files.filter(file => file.endsWith('.csproj'));
      
      for (const csprojFile of csprojFiles) {
        const csprojPath = path.join(projectPath, csprojFile);
        const csprojContent = await fs.readFile(csprojPath, 'utf-8');
        if (csprojContent.includes(dependencyName)) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }
  
  private async checkContent(projectPath: string, contentPattern: string, technology: TechnologyType): Promise<boolean> {
    try {
      return await this.searchInFiles(projectPath, contentPattern, technology);
    } catch {
      return false;
    }
  }
  
  private async searchInFiles(projectPath: string, pattern: string, technology: TechnologyType): Promise<boolean> {
    const extensions = this.getFileExtensions(technology);
    
    try {
      const found = await this.walkDirectoryForContent(projectPath, pattern, extensions);
      return found;
    } catch {
      return false;
    }
  }
  
  private getFileExtensions(technology: TechnologyType): string[] {
    switch (technology) {
      case 'nodejs':
        return ['.js', '.ts', '.json'];
      case 'java':
        return ['.java', '.xml', '.properties', '.yml', '.yaml'];
      case 'dotnet':
        return ['.cs', '.csproj', '.json', '.config'];
      default:
        return [];
    }
  }
  
  private async walkDirectoryForContent(
    dir: string, 
    pattern: string, 
    extensions: string[],
    maxDepth: number = 3,
    currentDepth: number = 0
  ): Promise<boolean> {
    if (currentDepth > maxDepth) return false;
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          const found = await this.walkDirectoryForContent(fullPath, pattern, extensions, maxDepth, currentDepth + 1);
          if (found) return true;
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              if (content.includes(pattern)) {
                return true;
              }
            } catch {
              // Ignorar errores de lectura de archivos
            }
          }
        }
      }
    } catch {
      // Ignorar errores de acceso a directorios
    }
    
    return false;
  }
  
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', 'target', 'build', 'dist', '.git', 'bin', 'obj'];
    return skipDirs.includes(dirName);
  }
  
  private getBestMatch(results: { [key in TechnologyType]?: { score: number; indicators: TechnologyIndicator[] } }): TechnologyDetectionResult {
    let bestTechnology: TechnologyType = 'unknown';
    let bestScore = 0;
    let bestIndicators: TechnologyIndicator[] = [];
    
    for (const [tech, result] of Object.entries(results)) {
      if (result && result.score > bestScore) {
        bestScore = result.score;
        bestTechnology = tech as TechnologyType;
        bestIndicators = result.indicators;
      }
    }
    
    // Determinar framework basado en indicadores
    const framework = this.detectFramework(bestTechnology, bestIndicators);
    
    return {
      technology: bestTechnology,
      confidence: bestScore,
      indicators: bestIndicators,
      framework
    };
  }
  
  private detectFramework(technology: TechnologyType, indicators: TechnologyIndicator[]): string | undefined {
    switch (technology) {
      case 'nodejs':
        if (indicators.some(i => i.name === '@nestjs/core' && i.found)) return 'NestJS';
        if (indicators.some(i => i.name === 'express' && i.found)) return 'Express';
        if (indicators.some(i => i.name === 'fastify' && i.found)) return 'Fastify';
        return 'Node.js';
      
      case 'java':
        if (indicators.some(i => i.name === 'spring-boot-starter' && i.found)) return 'Spring Boot';
        return 'Java';
      
      case 'dotnet':
        if (indicators.some(i => i.name === 'Microsoft.AspNetCore' && i.found)) return 'ASP.NET Core';
        return '.NET';
      
      default:
        return undefined;
    }
  }
  
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}