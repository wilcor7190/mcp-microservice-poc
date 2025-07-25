import { FileUtils } from '../utils/file-utils.js';
import { PatternMatcher } from '../utils/pattern-matcher.js';
import { RepositoryAnalysis, AnalyzedPattern } from '../types/index.js';

export class RepoAnalyzer {
  private analyses: RepositoryAnalysis[] = [];

  async analyzeReferenceRepos(inputDir: string): Promise<RepositoryAnalysis[]> {
    const referencePath = FileUtils.joinPaths(inputDir, 'reference-repos');
    
    if (!(await FileUtils.fileExists(referencePath))) {
      throw new Error('Reference repos directory not found');
    }

    const { directories } = await FileUtils.getDirectoryStructure(referencePath);
    
    console.log(`Found ${directories.length} reference repositories`);

    for (const repoDir of directories) {
      const repoPath = FileUtils.joinPaths(referencePath, repoDir);
      try {
        const analysis = await this.analyzeRepository(repoPath, repoDir);
        this.analyses.push(analysis);
        console.log(`Analyzed repository: ${repoDir}`);
      } catch (error) {
        console.error(`Failed to analyze repository ${repoDir}:`, error);
      }
    }

    return this.analyses;
  }

  private async analyzeRepository(repoPath: string, repoName: string): Promise<RepositoryAnalysis> {
    console.log(`Analyzing repository: ${repoName}`);

    const patterns = await PatternMatcher.analyzeRepository(repoPath);
    const structure = await this.analyzeStructure(repoPath);
    const dependencies = await this.extractDependencies(repoPath);
    
    // Determine framework and architecture from patterns
    const framework = this.extractFramework(patterns);
    const architecture = this.extractArchitecture(patterns);

    return {
      repo_path: repoPath,
      framework,
      architecture,
      patterns,
      dependencies,
      structure
    };
  }

  private async analyzeStructure(repoPath: string): Promise<any> {
    const structure = {
      directories: [] as string[],
      key_files: [] as string[],
      patterns_detected: [] as string[]
    };

    try {
      // Analyze src directory structure
      const srcPath = FileUtils.joinPaths(repoPath, 'src');
      if (await FileUtils.fileExists(srcPath)) {
        const srcStructure = await this.getDeepStructure(srcPath);
        structure.directories = srcStructure.directories;
      }

      // Find key files
      const keyFilePatterns = [
        'package.json',
        'nest-cli.json',
        'tsconfig.json',
        'Dockerfile',
        'docker-compose.yml',
        'README.md'
      ];

      for (const pattern of keyFilePatterns) {
        const files = await FileUtils.findFiles(`**/${pattern}`, repoPath);
        structure.key_files.push(...files);
      }

      // Detect common patterns
      if (structure.directories.includes('domain')) {
        structure.patterns_detected.push('clean-architecture');
      }
      if (structure.directories.includes('controllers')) {
        structure.patterns_detected.push('mvc-pattern');
      }
      if (structure.directories.includes('test') || structure.directories.includes('tests')) {
        structure.patterns_detected.push('testing-structure');
      }

    } catch (error) {
      console.error(`Error analyzing structure for ${repoPath}:`, error);
    }

    return structure;
  }

  private async getDeepStructure(dirPath: string, maxDepth = 3, currentDepth = 0): Promise<{
    directories: string[];
    files: string[];
  }> {
    const result = {
      directories: [] as string[],
      files: [] as string[]
    };

    if (currentDepth >= maxDepth) {
      return result;
    }

    try {
      const { directories, files } = await FileUtils.getDirectoryStructure(dirPath);
      
      result.directories.push(...directories);
      result.files.push(...files);

      // Recursively analyze subdirectories
      for (const dir of directories) {
        const subDirPath = FileUtils.joinPaths(dirPath, dir);
        const subStructure = await this.getDeepStructure(subDirPath, maxDepth, currentDepth + 1);
        
        // Add prefixed subdirectories
        result.directories.push(...subStructure.directories.map(d => `${dir}/${d}`));
        result.files.push(...subStructure.files.map(f => `${dir}/${f}`));
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }

    return result;
  }

  private async extractDependencies(repoPath: string): Promise<string[]> {
    try {
      const packageJsonPath = await FileUtils.findPackageJson(repoPath);
      if (!packageJsonPath) {
        return [];
      }

      const packageJson: any = await FileUtils.readJsonFile(packageJsonPath);
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      return Object.keys(deps);
    } catch (error) {
      console.error(`Error extracting dependencies from ${repoPath}:`, error);
      return [];
    }
  }

  private extractFramework(patterns: AnalyzedPattern[]): string {
    const frameworkPattern = patterns.find(p => p.pattern_type === 'framework');
    return frameworkPattern?.pattern_name || 'unknown';
  }

  private extractArchitecture(patterns: AnalyzedPattern[]): string {
    const archPattern = patterns.find(p => p.pattern_type === 'architecture');
    return archPattern?.pattern_name || 'unknown';
  }

  getAnalysesByFramework(framework: string): RepositoryAnalysis[] {
    return this.analyses.filter(analysis => analysis.framework === framework);
  }

  getAnalysesByArchitecture(architecture: string): RepositoryAnalysis[] {
    return this.analyses.filter(analysis => analysis.architecture === architecture);
  }

  getBestMatchingRepo(targetFramework?: string, targetArchitecture?: string): RepositoryAnalysis | null {
    if (this.analyses.length === 0) {
      return null;
    }

    // Filter by criteria
    let candidates = this.analyses;

    if (targetFramework) {
      const frameworkMatches = candidates.filter(a => a.framework === targetFramework);
      if (frameworkMatches.length > 0) {
        candidates = frameworkMatches;
      }
    }

    if (targetArchitecture) {
      const archMatches = candidates.filter(a => a.architecture === targetArchitecture);
      if (archMatches.length > 0) {
        candidates = archMatches;
      }
    }

    // Return the one with most patterns (most comprehensive)
    return candidates.reduce((best, current) => 
      current.patterns.length > best.patterns.length ? current : best
    );
  }

  getCommonPatterns(): AnalyzedPattern[] {
    const patternCounts: Record<string, {
      pattern: AnalyzedPattern;
      count: number;
    }> = {};

    // Count pattern occurrences
    for (const analysis of this.analyses) {
      for (const pattern of analysis.patterns) {
        const key = `${pattern.pattern_type}:${pattern.pattern_name}`;
        if (!patternCounts[key]) {
          patternCounts[key] = { pattern, count: 0 };
        }
        patternCounts[key].count++;
      }
    }

    // Return patterns that appear in more than half of the repos
    const threshold = Math.ceil(this.analyses.length / 2);
    return Object.values(patternCounts)
      .filter(({ count }) => count >= threshold)
      .map(({ pattern }) => pattern);
  }

  getFrameworkSpecificPatterns(framework: string): AnalyzedPattern[] {
    const frameworkRepos = this.getAnalysesByFramework(framework);
    const allPatterns: AnalyzedPattern[] = [];

    for (const repo of frameworkRepos) {
      allPatterns.push(...repo.patterns);
    }

    return allPatterns;
  }

  async findTemplateFiles(framework: string, pattern: string): Promise<string[]> {
    const matchingRepos = this.getAnalysesByFramework(framework);
    const templateFiles: string[] = [];

    for (const repo of matchingRepos) {
      const patternData = repo.patterns.find(p => p.pattern_name === pattern);
      if (patternData) {
        templateFiles.push(...patternData.files);
      }
    }

    return templateFiles;
  }

  async extractTemplateContent(filePath: string): Promise<string> {
    try {
      return await FileUtils.readFile(filePath);
    } catch (error) {
      console.error(`Error reading template file ${filePath}:`, error);
      return '';
    }
  }

  getRepositoryNames(): string[] {
    return this.analyses.map(analysis => 
      FileUtils.getFileName(analysis.repo_path)
    );
  }

  getAnalysisReport(): Record<string, any> {
    return {
      total_repositories: this.analyses.length,
      frameworks_detected: [...new Set(this.analyses.map(a => a.framework))],
      architectures_detected: [...new Set(this.analyses.map(a => a.architecture))],
      common_patterns: this.getCommonPatterns().map(p => ({
        type: p.pattern_type,
        name: p.pattern_name,
        description: p.description
      })),
      repositories: this.analyses.map(a => ({
        name: FileUtils.getFileName(a.repo_path),
        framework: a.framework,
        architecture: a.architecture,
        patterns_count: a.patterns.length,
        dependencies_count: a.dependencies.length
      }))
    };
  }

  getAnalyses(): RepositoryAnalysis[] {
    return this.analyses;
  }
}
