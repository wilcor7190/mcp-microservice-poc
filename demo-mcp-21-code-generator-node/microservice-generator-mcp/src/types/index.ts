export interface MicroserviceSpecification {
  metadata: {
    sourceFile: string;
    processedAt: string;
    version: string;
  };
  microservice: {
    name: string;
    description: string;
    version: string;
    port: number;
    team: string;
    repository: string;
    summary: string;
  };
  database: 'oracle' | 'postgresql' | 'mysql' | 'mongodb';
  endpoints: Endpoint[];
  integrations: Integration[];
  security: SecurityConfig;
  configuration: Configuration;
  technicalDetails: TechnicalDetails;
  businessValue: string;
  // Optional architecture field (backward compatibility)
  architecture?: {
    pattern: 'hexagonal' | 'clean' | 'layered';
    layers: string[];
    database: 'oracle' | 'postgresql' | 'mysql' | 'mongodb';
    framework: string;
  };
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: string[];
  responses: Response[];
  inputParameters: InputParameter[];
}

export interface Response {
  status: number;
  description: string;
}

export interface InputParameter {
  name: string;
  type: 'String' | 'Number' | 'Boolean' | 'Object';
  required: boolean;
  description: string;
}

export interface Integration {
  name: string;
  type: 'Base de datos' | 'API' | 'Message Queue';
  connection: string;
  description: string;
  configuration: string;
  legacyServices: LegacyService[];
}

export interface LegacyService {
  name: string;
  description: string;
  type: string;
  urls: {
    QA: string;
    PROD: string;
  };
  inputMapping: FieldMapping[];
  outputMapping: FieldMapping[];
}

export interface FieldMapping {
  microserviceField: string;
  legacyField: string;
  description: string;
  type: string;
  required: boolean;
}

export interface SecurityConfig {
  authentication: 'JWT' | 'OAuth2' | 'Basic';
  authorization: 'RBAC' | 'ABAC';
  cors: boolean;
}

export interface Configuration {
  environment: string[];
  secrets: string[];
  configMaps: string[];
}

export interface TechnicalDetails {
  changeType: string;
  hut: string;
  deployment: Record<string, any>;
  environments: string[];
  namespace: string;
  platform: string;
  capacity: string;
  automation: string;
  connectivity: string;
  repository: RepositoryConfig;
  apiGateway: ApiGatewayConfig;
}

export interface RepositoryConfig {
  exists: boolean;
  organization: string;
  url: string;
  branch: string;
}

export interface ApiGatewayConfig {
  exists: boolean;
  configuration: string;
}

export interface AnalyzedPattern {
  source_repo: string;
  pattern_type: string;
  pattern_name: string;
  description: string;
  files: string[];
  framework?: string;
  architecture?: string;
  database?: string;
  dependencies?: string[];
}

export interface GenerationReport {
  timestamp: string;
  microservice_name: string;
  specification_used: {
    name: string;
    version: string;
    port: number;
    database: string;
    endpoints_count: number;
    integrations_count: number;
  };
  patterns_applied: PatternApplied[];
  generated_files: GeneratedFiles;
  validation_results: ValidationResults;
  environment_setup: EnvironmentSetup;
  next_steps: string[];
}

export interface PatternApplied {
  source_repo: string;
  pattern: string;
  files_influenced: string[];
}

export interface GeneratedFiles {
  total: number;
  by_category: {
    source: number;
    tests: number;
    config: number;
    docs: number;
  };
  endpoints_implemented: EndpointImplemented[];
  integrations_implemented: IntegrationImplemented[];
}

export interface EndpointImplemented {
  path: string;
  method: string;
  controller: string;
  use_case: string;
}

export interface IntegrationImplemented {
  name: string;
  type: string;
  adapter: string;
}

export interface ValidationResults {
  typescript_compilation: string;
  tests_execution: string;
  linting: string;
  oracle_connection?: string;
  coverage: string;
}

export interface EnvironmentSetup {
  required_secrets: string[];
  config_files_generated: string[];
}

export interface RepositoryAnalysis {
  repo_path: string;
  framework: string;
  architecture: string;
  patterns: AnalyzedPattern[];
  dependencies: string[];
  structure: FileStructure;
}

export interface FileStructure {
  directories: string[];
  key_files: string[];
  patterns_detected: string[];
}
