/**
 * Core types for the MCP Orchestrator
 */

export interface MicroserviceSpecification {
  name: string;
  version: string;
  description: string;
  endpoints: Endpoint[];
  database: DatabaseConfig;
  integrations: Integration[];
  security: SecurityConfig;
  architecture: ArchitecturePattern;
  complexity?: ComplexityLevel;
}

export interface Endpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters: Parameter[];
  responses: Response[];
  security?: string[];
}

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  location: 'query' | 'path' | 'header' | 'body';
}

export interface Response {
  status: number;
  description: string;
  schema?: string;
}

export interface DatabaseConfig {
  type: 'oracle' | 'mysql' | 'postgresql' | 'mongodb' | 'mssql';
  version?: string;
  connectionType: 'direct' | 'pool' | 'jndi';
  procedures?: StoredProcedure[];
}

export interface StoredProcedure {
  name: string;
  description: string;
  parameters: ProcedureParameter[];
}

export interface ProcedureParameter {
  name: string;
  type: string;
  direction: 'IN' | 'OUT' | 'INOUT';
}

export interface Integration {
  type: 'rest' | 'soap' | 'stored-procedure' | 'message-queue' | 'event';
  name: string;
  description: string;
  configuration: Record<string, any>;
}

export interface SecurityConfig {
  authentication: 'jwt' | 'oauth2' | 'basic' | 'none';
  authorization: 'rbac' | 'abac' | 'none';
  requirements: string[];
}

export type ArchitecturePattern = 'clean' | 'layered' | 'hexagonal' | 'mvc' | 'event-driven';
export type ComplexityLevel = 'low' | 'medium' | 'high' | 'very-high';
export type TechnologyType = 'nodejs' | 'springboot';

export interface RepositoryInfo {
  name: string;
  path: string;
  technology: TechnologyType;
  patterns: string[];
  compatibility: number;
  description: string;
  lastModified: Date;
  size: number;
}

export interface TechnologyAnalysis {
  specification: MicroserviceSpecification;
  repositoryAnalysis: {
    nodejs: RepositoryAnalysisResult;
    springboot: RepositoryAnalysisResult;
  };
  recommendations: TechnologyRecommendation[];
}

export interface RepositoryAnalysisResult {
  repositories: RepositoryInfo[];
  averageCompatibility: number;
  bestMatch: RepositoryInfo | null;
  patterns: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface TechnologyRecommendation {
  technology: TechnologyType;
  score: number;
  confidence: number;
  reasoning: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  developmentTime: string;
  riskFactors: string[];
}

export interface TechnologyComparison {
  nodejs: TechnologyOption;
  springboot: TechnologyOption;
  recommendation: TechnologyRecommendation;
}

export interface TechnologyOption {
  technology: TechnologyType;
  compatibilityScore: number;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  estimatedEffort: string;
  developmentTime: string;
  repositoriesAvailable: number;
  metrics: TechnologyMetrics;
}

export interface TechnologyMetrics {
  filesGenerated: number;
  compatibilityPercentage: number;
  complexityScore: number;
  maintenanceScore: number;
}

export interface UserChoice {
  technology: TechnologyType;
  confirmed: boolean;
  timestamp: Date;
  reason?: string;
}

export interface GenerationOptions {
  technology: TechnologyType;
  specificationPath: string;
  referencePath: string;
  outputPath: string;
  skipValidation?: boolean;
  generateDocs?: boolean;
}

export interface GenerationResult {
  success: boolean;
  technology: TechnologyType;
  outputPath: string;
  filesGenerated: number;
  executionTime: number;
  errors: string[];
  warnings: string[];
  reportPath: string;
}

export interface OrchestrationReport {
  timestamp: Date;
  orchestratorVersion: string;
  processId: string;
  inputAnalysis: InputAnalysisResult;
  repositoryAnalysis: RepositoryAnalysisResult;
  technologySelection: TechnologySelectionResult;
  mcpExecution: MCPExecutionResult;
  finalOutput: FinalOutputResult;
  nextSteps: string[];
}

export interface InputAnalysisResult {
  specificationFile: string;
  specificationValid: boolean;
  microserviceName: string;
  complexityScore: number;
  estimatedEffort: string;
}

export interface TechnologySelectionResult {
  recommended: TechnologyType;
  userChoice: TechnologyType;
  reason: string;
  selectionTimestamp: Date;
}

export interface MCPExecutionResult {
  selectedMCP: string;
  connectionStatus: 'success' | 'failed';
  executionTime: string;
  generationStatus: 'completed' | 'failed' | 'partial';
  filesGenerated: number;
  validationPassed: boolean;
  errors?: string[];
}

export interface FinalOutputResult {
  outputPath: string;
  documentationGenerated: boolean;
  reportsConsolidated: boolean;
  readyForDeployment: boolean;
}

export interface MCPConfig {
  nodejsGenerator: MCPGeneratorConfig;
  springbootGenerator: MCPGeneratorConfig;
  fileOperations: FileOperationsConfig;
  analysis: AnalysisConfig;
  userInterface: UIConfig;
}

export interface MCPGeneratorConfig {
  path: string;
  inputDirectory: string;
  outputDirectory: string;
  command: string;
  args?: string[];
  cwd?: string;
  timeout: number;
  retryAttempts: number;
  // Legacy field for backward compatibility
  executable?: string;
}

export interface FileOperationsConfig {
  cleanupAfterExecution: boolean;
  backupBeforeOverwrite: boolean;
  preserveLogs: boolean;
}

export interface AnalysisConfig {
  repositoryScanDepth: number;
  compatibilityThreshold: number;
  complexityFactors: string[];
}

export interface UIConfig {
  interactiveMode: boolean;
  showDetailedComparison: boolean;
  autoRecommend: boolean;
  confirmationRequired: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
  executionTime: number;
}

export interface ProgressStream {
  status: 'running' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  message: string;
  timestamp: Date;
}

export interface FileTransferResult {
  success: boolean;
  sourceFiles: string[];
  targetPath: string;
  filesTransferred: number;
  errors: string[];
}
