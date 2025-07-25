import { promises as fs } from 'fs';
import path from 'path';
import { RepositoryAnalysis, PackageStructure } from '../types/index.js';

export class RepoAnalyzer {
  
  async analyzeRepositories(repoPath: string): Promise<RepositoryAnalysis[]> {
    console.error(`[RepoAnalyzer] Analizando repositorios en: ${repoPath}`);
    
    try {
      const entries = await fs.readdir(repoPath, { withFileTypes: true });
      const directories = entries.filter(entry => entry.isDirectory());
      
      const analyses: RepositoryAnalysis[] = [];
      
      for (const dir of directories) {
        const dirPath = path.join(repoPath, dir.name);
        const analysis = await this.analyzeRepository(dirPath, dir.name);
        if (analysis) {
          analyses.push(analysis);
        }
      }
      
      console.error(`[RepoAnalyzer] ${analyses.length} repositorios analizados`);
      return analyses;
      
    } catch (error) {
      console.error(`[RepoAnalyzer] Error analizando repositorios:`, error);
      return [];
    }
  }
  
  private async analyzeRepository(repoPath: string, repoName: string): Promise<RepositoryAnalysis | null> {
    console.error(`[RepoAnalyzer] Analizando repositorio: ${repoName}`);
    
    try {
      const analysis: RepositoryAnalysis = {
        name: repoName,
        path: repoPath,
        framework: 'unknown',
        architecture: 'unknown',
        database: 'unknown',
        layers: [],
        dependencies: [],
        testingFramework: 'unknown',
        packageStructure: {
          basePackage: '',
          layers: {
            controller: [],
            service: [],
            repository: [],
            domain: [],
            config: []
          }
        },
        configFiles: [],
        buildTool: 'unknown'
      };
      
      // Detectar build tool
      const hasPom = await this.fileExists(path.join(repoPath, 'pom.xml'));
      const hasGradle = await this.fileExists(path.join(repoPath, 'build.gradle')) || 
                       await this.fileExists(path.join(repoPath, 'build.gradle.kts'));
      
      if (hasPom) {
        analysis.buildTool = 'maven';
        await this.analyzeMavenProject(repoPath, analysis);
      } else if (hasGradle) {
        analysis.buildTool = 'gradle';
        await this.analyzeGradleProject(repoPath, analysis);
      }
      
      // Analizar estructura de paquetes Java
      await this.analyzeJavaPackageStructure(repoPath, analysis);
      
      // Detectar framework
      analysis.framework = this.detectFramework(analysis.dependencies);
      
      // Detectar arquitectura
      analysis.architecture = this.detectArchitecture(analysis.layers, analysis.packageStructure);
      
      // Detectar base de datos
      analysis.database = this.detectDatabase(analysis.dependencies);
      
      // Detectar framework de testing
      analysis.testingFramework = this.detectTestingFramework(analysis.dependencies);
      
      console.error(`[RepoAnalyzer] Repositorio analizado: ${repoName} (${analysis.framework})`);
      return analysis;
      
    } catch (error) {
      console.error(`[RepoAnalyzer] Error analizando repositorio ${repoName}:`, error);
      return null;
    }
  }
  
  private async analyzeMavenProject(repoPath: string, analysis: RepositoryAnalysis): Promise<void> {
    const pomPath = path.join(repoPath, 'pom.xml');
    
    try {
      const pomContent = await fs.readFile(pomPath, 'utf-8');
      analysis.configFiles.push('pom.xml');
      
      // Extraer dependencias del POM
      const dependencies = this.extractMavenDependencies(pomContent);
      analysis.dependencies = dependencies;
      
      // Extraer groupId como base package
      const groupIdMatch = pomContent.match(/<groupId>([^<]+)<\/groupId>/);
      if (groupIdMatch) {
        analysis.packageStructure.basePackage = groupIdMatch[1];
      }
      
    } catch (error) {
      console.error(`[RepoAnalyzer] Error leyendo pom.xml:`, error);
    }
  }
  
  private async analyzeGradleProject(repoPath: string, analysis: RepositoryAnalysis): Promise<void> {
    const gradlePaths = [
      path.join(repoPath, 'build.gradle'),
      path.join(repoPath, 'build.gradle.kts')
    ];
    
    for (const gradlePath of gradlePaths) {
      if (await this.fileExists(gradlePath)) {
        try {
          const gradleContent = await fs.readFile(gradlePath, 'utf-8');
          analysis.configFiles.push(path.basename(gradlePath));
          
          // Extraer dependencias básicas
          const dependencies = this.extractGradleDependencies(gradleContent);
          analysis.dependencies = dependencies;
          
        } catch (error) {
          console.error(`[RepoAnalyzer] Error leyendo ${gradlePath}:`, error);
        }
        break;
      }
    }
  }
  
  private async analyzeJavaPackageStructure(repoPath: string, analysis: RepositoryAnalysis): Promise<void> {
    const srcPath = path.join(repoPath, 'src', 'main', 'java');
    
    if (await this.fileExists(srcPath)) {
      const packages = await this.findJavaPackages(srcPath);
      
      // Detectar base package (el más común o el más corto)
      if (packages.length > 0) {
        const basePackage = this.findBasePackage(packages);
        analysis.packageStructure.basePackage = basePackage;
      }
      
      // Clasificar paquetes por layers
      for (const pkg of packages) {
        if (pkg.includes('controller') || pkg.includes('web') || pkg.includes('interfaces')) {
          analysis.packageStructure.layers.controller.push(pkg);
          if (!analysis.layers.includes('controller')) analysis.layers.push('controller');
        }
        if (pkg.includes('service') || pkg.includes('application')) {
          analysis.packageStructure.layers.service.push(pkg);
          if (!analysis.layers.includes('service')) analysis.layers.push('service');
        }
        if (pkg.includes('repository') || pkg.includes('infrastructure') || pkg.includes('persistence')) {
          analysis.packageStructure.layers.repository.push(pkg);
          if (!analysis.layers.includes('repository')) analysis.layers.push('repository');
        }
        if (pkg.includes('domain') || pkg.includes('model') || pkg.includes('entity')) {
          analysis.packageStructure.layers.domain.push(pkg);
          if (!analysis.layers.includes('domain')) analysis.layers.push('domain');
        }
        if (pkg.includes('config') || pkg.includes('configuration')) {
          analysis.packageStructure.layers.config.push(pkg);
          if (!analysis.layers.includes('config')) analysis.layers.push('config');
        }
      }
    }
  }
  
  private async findJavaPackages(srcPath: string): Promise<string[]> {
    const packages: string[] = [];
    
    try {
      await this.walkDirectory(srcPath, async (filePath) => {
        if (filePath.endsWith('.java')) {
          const relativePath = path.relative(srcPath, path.dirname(filePath));
          const packageName = relativePath.replace(/[\\/]/g, '.');
          if (packageName && !packages.includes(packageName)) {
            packages.push(packageName);
          }
        }
      });
    } catch (error) {
      console.error(`[RepoAnalyzer] Error explorando paquetes Java:`, error);
    }
    
    return packages;
  }
  
  private async walkDirectory(dir: string, callback: (filePath: string) => Promise<void>): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await this.walkDirectory(fullPath, callback);
        } else {
          await callback(fullPath);
        }
      }
    } catch (error) {
      // Ignorar errores de acceso a directorios
    }
  }
  
  private findBasePackage(packages: string[]): string {
    if (packages.length === 0) return '';
    
    // Encontrar el prefijo común más largo
    let commonPrefix = packages[0];
    
    for (let i = 1; i < packages.length; i++) {
      let j = 0;
      while (j < commonPrefix.length && j < packages[i].length && 
             commonPrefix[j] === packages[i][j]) {
        j++;
      }
      commonPrefix = commonPrefix.substring(0, j);
    }
    
    // Asegurar que termine en un punto completo
    const lastDot = commonPrefix.lastIndexOf('.');
    if (lastDot > 0) {
      commonPrefix = commonPrefix.substring(0, lastDot);
    }
    
    return commonPrefix;
  }
  
  private extractMavenDependencies(pomContent: string): string[] {
    const dependencies: string[] = [];
    const dependencyRegex = /<artifactId>([^<]+)<\/artifactId>/g;
    let match;
    
    while ((match = dependencyRegex.exec(pomContent)) !== null) {
      dependencies.push(match[1]);
    }
    
    return dependencies;
  }
  
  private extractGradleDependencies(gradleContent: string): string[] {
    const dependencies: string[] = [];
    
    // Expresiones regulares para diferentes formatos de dependencias en Gradle
    const patterns = [
      /implementation\s+['"]([^'"]+)['"]/g,
      /compile\s+['"]([^'"]+)['"]/g,
      /api\s+['"]([^'"]+)['"]/g,
      /testImplementation\s+['"]([^'"]+)['"]/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(gradleContent)) !== null) {
        const fullDep = match[1];
        const artifactId = fullDep.split(':').pop() || fullDep;
        if (!dependencies.includes(artifactId)) {
          dependencies.push(artifactId);
        }
      }
    }
    
    return dependencies;
  }
  
  private detectFramework(dependencies: string[]): string {
    if (dependencies.some(dep => dep.includes('spring-boot'))) {
      return 'spring-boot';
    }
    if (dependencies.some(dep => dep.includes('spring'))) {
      return 'spring';
    }
    if (dependencies.some(dep => dep.includes('quarkus'))) {
      return 'quarkus';
    }
    if (dependencies.some(dep => dep.includes('micronaut'))) {
      return 'micronaut';
    }
    return 'unknown';
  }
  
  private detectArchitecture(layers: string[], packageStructure: PackageStructure): string {
    const hasController = layers.includes('controller');
    const hasService = layers.includes('service');
    const hasRepository = layers.includes('repository');
    const hasDomain = layers.includes('domain');
    
    if (hasController && hasService && hasRepository && hasDomain) {
      // Verificar si sigue patrones de arquitectura hexagonal
      const hasInfrastructure = packageStructure.layers.repository.some(pkg => 
        pkg.includes('infrastructure')
      );
      const hasApplication = packageStructure.layers.service.some(pkg => 
        pkg.includes('application')
      );
      
      if (hasInfrastructure && hasApplication) {
        return 'hexagonal';
      }
      
      return 'layered';
    }
    
    if (hasController && hasService) {
      return 'mvc';
    }
    
    return 'unknown';
  }
  
  private detectDatabase(dependencies: string[]): string {
    if (dependencies.some(dep => dep.includes('ojdbc') || dep.includes('oracle'))) {
      return 'oracle';
    }
    if (dependencies.some(dep => dep.includes('postgresql'))) {
      return 'postgresql';
    }
    if (dependencies.some(dep => dep.includes('mysql'))) {
      return 'mysql';
    }
    if (dependencies.some(dep => dep.includes('mongodb') || dep.includes('mongo'))) {
      return 'mongodb';
    }
    if (dependencies.some(dep => dep.includes('h2'))) {
      return 'h2';
    }
    return 'unknown';
  }
  
  private detectTestingFramework(dependencies: string[]): string {
    if (dependencies.some(dep => dep.includes('junit-jupiter') || dep.includes('junit5'))) {
      return 'junit5';
    }
    if (dependencies.some(dep => dep.includes('junit'))) {
      return 'junit4';
    }
    if (dependencies.some(dep => dep.includes('testng'))) {
      return 'testng';
    }
    if (dependencies.some(dep => dep.includes('spock'))) {
      return 'spock';
    }
    return 'unknown';
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