export interface MicroserviceProject {
  name: string;
  path: string;
  technology: TechnologyType;
  version?: string;
  description?: string;
}

export type TechnologyType = 'nodejs' | 'java' | 'dotnet' | 'unknown';

export interface ValidationRequest {
  projectPath: string;
  standards?: StandardsConfig;
  outputPath?: string;
}

export interface StandardsConfig {
  security: boolean;
  testing: boolean;
  coverage: boolean;
  codeQuality: boolean;
  documentation: boolean;
  performance: boolean;
}

export interface ValidationReport {
  project: MicroserviceProject;
  timestamp: string;
  overallScore: number;
  overallStatus: 'PASSED' | 'WARNING' | 'FAILED';
  categories: ValidationCategory[];
  recommendations: Recommendation[];
  summary: ValidationSummary;
  executionTime: number;
}

export interface ValidationCategory {
  name: string;
  score: number;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  rules: ValidationRule[];
  weight: number;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  message?: string;
  file?: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

export interface Recommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  action: string;
  impact: string;
  effort: string;
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
  maintainabilityIndex?: number;
}

export interface TechnologyDetectionResult {
  technology: TechnologyType;
  confidence: number;
  indicators: TechnologyIndicator[];
  framework?: string;
  version?: string;
}

export interface TechnologyIndicator {
  type: 'file' | 'dependency' | 'structure' | 'content';
  name: string;
  weight: number;
  found: boolean;
}

export interface MCPValidatorInfo {
  technology: TechnologyType;
  name: string;
  path: string;
  command: string;
  args: string[];
  available: boolean;
}

export interface OrchestrationResult {
  success: boolean;
  validationReport?: ValidationReport;
  error?: string;
  delegatedTo?: MCPValidatorInfo;
  executionTime: number;
}