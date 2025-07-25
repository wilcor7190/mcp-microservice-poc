import * as fs from 'fs-extra';
import * as fsNative from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export class FileUtils {
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fsNative.promises.writeFile(filePath, content, 'utf8');
  }

  static async readFile(filePath: string): Promise<string> {
    return await fsNative.promises.readFile(filePath, 'utf8');
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      return await fs.pathExists(filePath);
    } catch {
      return false;
    }
  }

  static async copyFile(src: string, dest: string): Promise<void> {
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }

  static async findFiles(pattern: string, cwd?: string): Promise<string[]> {
    return await glob(pattern, { cwd: cwd || process.cwd() });
  }

  static async readJsonFile<T>(filePath: string): Promise<T> {
    const content = await this.readFile(filePath);
    return JSON.parse(content) as T;
  }

  static async writeJsonFile(filePath: string, data: any): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await this.writeFile(filePath, content);
  }

  static async getDirectoryStructure(dirPath: string): Promise<{
    directories: string[];
    files: string[];
  }> {
    const items = await fsNative.promises.readdir(dirPath, { withFileTypes: true });
    
    const directories: string[] = [];
    const files: string[] = [];

    for (const item of items) {
      if (item.isDirectory()) {
        directories.push(item.name);
      } else {
        files.push(item.name);
      }
    }

    return { directories, files };
  }

  static async findPackageJson(startDir: string): Promise<string | null> {
    let currentDir = startDir;
    
    while (currentDir !== path.dirname(currentDir)) {
      const packageJsonPath = path.join(currentDir, 'package.json');
      if (await this.fileExists(packageJsonPath)) {
        return packageJsonPath;
      }
      currentDir = path.dirname(currentDir);
    }
    
    return null;
  }

  static getRelativePath(from: string, to: string): string {
    return path.relative(from, to).replace(/\\/g, '/');
  }

  static joinPaths(...paths: string[]): string {
    return path.join(...paths);
  }

  static getFileName(filePath: string): string {
    return path.basename(filePath);
  }

  static getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  static getDirectoryName(filePath: string): string {
    return path.dirname(filePath);
  }

  static async deleteDirectory(dirPath: string): Promise<void> {
    if (await this.fileExists(dirPath)) {
      await fs.remove(dirPath);
    }
  }

  static async createDirectoryStructure(basePath: string, structure: string[]): Promise<void> {
    for (const dir of structure) {
      const fullPath = path.join(basePath, dir);
      await this.ensureDir(fullPath);
    }
  }
}
