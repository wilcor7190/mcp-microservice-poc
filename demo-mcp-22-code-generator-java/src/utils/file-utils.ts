import { promises as fs } from 'fs';
import path from 'path';
import { ValidationResult, ValidationIssue, ProjectStructure } from '../types/index.js';

export class FileUtils {
  
  async validateJavaProject(projectPath: string): Promise<ValidationResult> {
    console.error(`[FileUtils] Validando proyecto Java en: ${projectPath}`);
    
    const result: ValidationResult = {
      isValid: true,
      issues: [],
      filesChecked: 0,
      structure: {
        hasPom: false,
        hasMainClass: false,
        hasControllers: false,
        hasServices: false,
        hasRepositories: false,
        hasTests: false,
        packagesFound: []
      }
    };
    
    try {
      // Validar estructura básica
      await this.validateBasicStructure(projectPath, result);
      
      // Validar archivos Java
      await this.validateJavaFiles(projectPath, result);
      
      // Validar archivos de configuración
      await this.validateConfigFiles(projectPath, result);
      
      // Determinar si el proyecto es válido
      result.isValid = result.issues.filter(issue => issue.type === 'error').length === 0;
      
      console.error(`[FileUtils] Validación completada: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
      return result;
      
    } catch (error) {
      console.error(`[FileUtils] Error durante la validación:`, error);
      result.issues.push({
        type: 'error',
        file: 'project',
        message: `Error durante la validación: ${error}`
      });
      result.isValid = false;
      return result;
    }
  }
  
  private async validateBasicStructure(projectPath: string, result: ValidationResult): Promise<void> {
    // Verificar pom.xml
    const pomPath = path.join(projectPath, 'pom.xml');
    result.structure.hasPom = await this.fileExists(pomPath);
    
    if (!result.structure.hasPom) {
      result.issues.push({
        type: 'error',
        file: 'pom.xml',
        message: 'El archivo pom.xml no existe'
      });
    } else {
      result.filesChecked++;
    }
    
    // Verificar estructura de directorios
    const requiredDirs = [
      'src/main/java',
      'src/main/resources',
      'src/test/java'
    ];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(projectPath, dir);
      const exists = await this.directoryExists(dirPath);
      
      if (!exists) {
        result.issues.push({
          type: 'warning',
          file: dir,
          message: `El directorio ${dir} no existe`
        });
      }
    }
  }
  
  private async validateJavaFiles(projectPath: string, result: ValidationResult): Promise<void> {
    const srcPath = path.join(projectPath, 'src', 'main', 'java');
    
    if (await this.directoryExists(srcPath)) {
      const javaFiles = await this.findJavaFiles(srcPath);
      result.filesChecked += javaFiles.length;
      
      // Analizar cada archivo Java
      for (const javaFile of javaFiles) {
        await this.analyzeJavaFile(javaFile, srcPath, result);
      }
      
      // Verificar que existan los tipos de archivos necesarios
      if (!result.structure.hasMainClass) {
        result.issues.push({
          type: 'error',
          file: 'main class',
          message: 'No se encontró la clase principal con @SpringBootApplication'
        });
      }
      
      if (!result.structure.hasControllers) {
        result.issues.push({
          type: 'warning',
          file: 'controllers',
          message: 'No se encontraron controladores (@RestController)'
        });
      }
    }
    
    // Validar tests
    const testPath = path.join(projectPath, 'src', 'test', 'java');
    if (await this.directoryExists(testPath)) {
      const testFiles = await this.findJavaFiles(testPath);
      result.structure.hasTests = testFiles.length > 0;
      result.filesChecked += testFiles.length;
      
      if (!result.structure.hasTests) {
        result.issues.push({
          type: 'warning',
          file: 'tests',
          message: 'No se encontraron archivos de test'
        });
      }
    }
  }
  
  private async validateConfigFiles(projectPath: string, result: ValidationResult): Promise<void> {
    const resourcesPath = path.join(projectPath, 'src', 'main', 'resources');
    
    // Verificar application.yml o application.properties
    const ymlPath = path.join(resourcesPath, 'application.yml');
    const propsPath = path.join(resourcesPath, 'application.properties');
    
    const hasYml = await this.fileExists(ymlPath);
    const hasProps = await this.fileExists(propsPath);
    
    if (!hasYml && !hasProps) {
      result.issues.push({
        type: 'error',
        file: 'application config',
        message: 'No se encontró application.yml ni application.properties'
      });
    } else {
      result.filesChecked++;
    }
    
    // Verificar Dockerfile
    const dockerfilePath = path.join(projectPath, 'docker', 'Dockerfile');
    if (!(await this.fileExists(dockerfilePath))) {
      result.issues.push({
        type: 'info',
        file: 'Dockerfile',
        message: 'No se encontró Dockerfile en la carpeta docker'
      });
    } else {
      result.filesChecked++;
    }
  }
  
  private async analyzeJavaFile(filePath: string, basePath: string, result: ValidationResult): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(basePath, filePath);
      const packagePath = path.dirname(relativePath).replace(/[\\/]/g, '.');
      
      if (packagePath && !result.structure.packagesFound.includes(packagePath)) {
        result.structure.packagesFound.push(packagePath);
      }
      
      // Detectar tipo de clase
      if (content.includes('@SpringBootApplication')) {
        result.structure.hasMainClass = true;
      }
      
      if (content.includes('@RestController') || content.includes('@Controller')) {
        result.structure.hasControllers = true;
      }
      
      if (content.includes('@Service')) {
        result.structure.hasServices = true;
      }
      
      if (content.includes('@Repository') || content.includes('extends JpaRepository')) {
        result.structure.hasRepositories = true;
      }
      
      // Validaciones de sintaxis básica
      if (!content.includes('package ')) {
        result.issues.push({
          type: 'warning',
          file: relativePath,
          message: 'El archivo no tiene declaración de package'
        });
      }
      
      // Verificar que las clases públicas coincidan con el nombre del archivo
      const className = path.basename(filePath, '.java');
      const publicClassRegex = new RegExp(`public\\s+(?:class|interface|enum)\\s+${className}\\b`);
      
      if (!publicClassRegex.test(content)) {
        result.issues.push({
          type: 'warning',
          file: relativePath,
          message: `La clase pública debería llamarse ${className}`
        });
      }
      
    } catch (error) {
      result.issues.push({
        type: 'error',
        file: path.relative(basePath, filePath),
        message: `Error leyendo archivo: ${error}`
      });
    }
  }
  
  private async findJavaFiles(directory: string): Promise<string[]> {
    const javaFiles: string[] = [];
    
    try {
      await this.walkDirectory(directory, (filePath) => {
        if (filePath.endsWith('.java')) {
          javaFiles.push(filePath);
        }
      });
    } catch (error) {
      console.error(`[FileUtils] Error explorando directorio ${directory}:`, error);
    }
    
    return javaFiles;
  }
  
  private async walkDirectory(dir: string, callback: (filePath: string) => void): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await this.walkDirectory(fullPath, callback);
        } else {
          callback(fullPath);
        }
      }
    } catch (error) {
      // Ignorar errores de acceso a directorios
    }
  }
  
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(filePath);
      return stat.isFile();
    } catch {
      return false;
    }
  }
  
  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }
  
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error(`[FileUtils] Error creando directorio ${dirPath}:`, error);
      throw error;
    }
  }
  
  async copyFile(source: string, destination: string): Promise<void> {
    try {
      await this.ensureDirectoryExists(path.dirname(destination));
      await fs.copyFile(source, destination);
    } catch (error) {
      console.error(`[FileUtils] Error copiando archivo de ${source} a ${destination}:`, error);
      throw error;
    }
  }
  
  async writeFileWithBackup(filePath: string, content: string): Promise<void> {
    try {
      // Crear backup si el archivo existe
      if (await this.fileExists(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copyFile(filePath, backupPath);
        console.error(`[FileUtils] Backup creado: ${backupPath}`);
      }
      
      await this.ensureDirectoryExists(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');
      
    } catch (error) {
      console.error(`[FileUtils] Error escribiendo archivo ${filePath}:`, error);
      throw error;
    }
  }
}