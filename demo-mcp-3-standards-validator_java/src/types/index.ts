export interface JavaProject {
  name: string;
  path: string;
  buildTool: 'maven' | 'gradle' | 'unknown';
  projectInfo: ProjectInfo;
  framework: JavaFramework;
  javaVersion: string;
  springBootVersion?: string;
}

export interface ProjectInfo {
  groupId: string;
  artifactId: string;
  version: string;
  description?: string;
  dependencies: Dependency[];
  plugins: Plugin[];
  properties: Record<string, string>;
}

export interface Dependency {
  groupId: string;
  artifactId: string;
  version?: string;
  scope?: string;
}

export interface Plugin {
  groupId: string;
  artifactId: string;
  version?: string;
  configuration?: any;
}

export type JavaFramework = 'spring-boot' | 'spring' | 'jakarta-ee' | 'quarkus' | 'micronaut' | 'vanilla' | 'unknown';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: ValidationCategory;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  validator: (project: JavaProject) => Promise<ValidationResult>;
}

export type ValidationCategory = 'security' | 'testing' | 'coverage' | 'codeQuality' | 'documentation' | 'performance';

export interface ValidationResult {
  status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'WARNING' | 'INFO';
  message?: string;
  details?: ValidationDetail[];
  score: number;
  suggestions?: string[];
}

export interface ValidationDetail {
  file?: string;
  line?: number;
  column?: number;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export interface JavaValidationReport {
  project: JavaProject;
  timestamp: string;
  overallScore: number;
  overallStatus: 'PASSED' | 'WARNING' | 'FAILED';
  categories: CategoryReport[];
  recommendations: Recommendation[];
  summary: ValidationSummary;
  executionTime: number;
}

export interface CategoryReport {
  name: ValidationCategory;
  score: number;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  rules: RuleReport[];
  weight: number;
}

export interface RuleReport {
  rule: ValidationRule;
  result: ValidationResult;
}

export interface Recommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: ValidationCategory;
  title: string;
  description: string;
  action: string;
  impact: string;
  effort: 'Low' | 'Medium' | 'High';
  resources?: string[];
}

export interface ValidationSummary {
  totalRules: number;
  passedRules: number;
  failedRules: number;
  warningRules: number;
  skippedRules: number;
  coveragePercentage?: number;
  securityIssues: number;
  performanceIssues: number;
  codeSmells: number;
  testClasses: number;
}

export interface StandardsConfig {
  security: boolean;
  testing: boolean;
  coverage: boolean;
  codeQuality: boolean;
  documentation: boolean;
  performance: boolean;
}

export interface MavenProject {
  groupId: string;
  artifactId: string;
  version: string;
  packaging?: string;
  name?: string;
  description?: string;
  properties: Record<string, string>;
  dependencies: Dependency[];
  plugins: Plugin[];
  parent?: {
    groupId: string;
    artifactId: string;
    version: string;
  };
}

export interface TestCoverageReport {
  lineCoverage: number;
  branchCoverage: number;
  methodCoverage: number;
  classCoverage: number;
  details: CoverageDetail[];
}

export interface CoverageDetail {
  className: string;
  packageName: string;
  lineCoverage: number;
  branchCoverage: number;
  methodCoverage: number;
}

export interface SecurityScanResult {
  vulnerabilities: SecurityVulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cwe?: string;
  description: string;
  location?: {
    file: string;
    line?: number;
  };
  recommendation: string;
}

export interface CodeQualityReport {
  issues: CodeQualityIssue[];
  metrics: {
    linesOfCode: number;
    complexity: number;
    duplicatedLines: number;
    techDebt: string;
  };
}

export interface CodeQualityIssue {
  rule: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  file: string;
  line?: number;
  column?: number;
}