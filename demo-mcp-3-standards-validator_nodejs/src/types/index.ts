export interface NodeJSProject {
  name: string;
  path: string;
  packageJson: PackageJsonInfo;
  framework: NodeJSFramework;
  hasTypeScript: boolean;
  testFramework?: string;
}

export interface PackageJsonInfo {
  name: string;
  version: string;
  description?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  main?: string;
  type?: string;
}

export type NodeJSFramework = 'nestjs' | 'express' | 'fastify' | 'koa' | 'vanilla' | 'unknown';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: ValidationCategory;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  validator: (project: NodeJSProject) => Promise<ValidationResult>;
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

export interface NodeJSValidationReport {
  project: NodeJSProject;
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
  lintErrors: number;
  testFiles: number;
}

export interface ESLintResult {
  filePath: string;
  messages: ESLintMessage[];
  errorCount: number;
  warningCount: number;
}

export interface ESLintMessage {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
}

export interface TestCoverageReport {
  total: CoverageStats;
  files: Record<string, CoverageStats>;
}

export interface CoverageStats {
  lines: CoverageMetric;
  functions: CoverageMetric;
  branches: CoverageMetric;
  statements: CoverageMetric;
}

export interface CoverageMetric {
  covered: number;
  total: number;
  percentage: number;
}

export interface SecurityAuditResult {
  vulnerabilities: SecurityVulnerability[];
  summary: {
    total: number;
    high: number;
    moderate: number;
    low: number;
    info: number;
  };
}

export interface SecurityVulnerability {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'moderate' | 'low' | 'info';
  vulnerable_versions: string;
  patched_versions: string;
  module_name: string;
  recommendation: string;
}

export interface StandardsConfig {
  security: boolean;
  testing: boolean;
  coverage: boolean;
  codeQuality: boolean;
  documentation: boolean;
  performance: boolean;
}