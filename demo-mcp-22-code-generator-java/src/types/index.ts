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
    team?: string;
    repository?: string;
    summary?: string;
  };
  database: string;
  endpoints: Endpoint[];
  integrations: Integration[];
  security: {
    authentication: string;
    authorization: string;
    cors: boolean;
  };
  configuration: {
    environment: string[];
    secrets: string[];
    configMaps: string[];
  };
  technicalDetails?: any;
  businessValue?: string;
}

export interface Endpoint {
  method: string;
  path: string;
  description: string;
  parameters: string[];
  responses: Response[];
  inputParameters?: InputParameter[];
  outputParameters?: any[];
  validationRules?: any[];
  examples?: any;
}

export interface Response {
  status: number;
  description: string;
}

export interface InputParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Integration {
  name: string;
  type: string;
  connection: string;
  description: string;
  configuration?: string;
  legacyServices?: LegacyService[];
}

export interface LegacyService {
  name: string;
  description: string;
  type: string;
  urls: Record<string, string>;
  configuration: string;
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

export interface RepositoryAnalysis {
  name: string;
  path: string;
  framework: string;
  architecture: string;
  database: string;
  layers: string[];
  dependencies: string[];
  testingFramework: string;
  packageStructure: PackageStructure;
  configFiles: string[];
  buildTool: string;
}

export interface PackageStructure {
  basePackage: string;
  layers: {
    controller: string[];
    service: string[];
    repository: string[];
    domain: string[];
    config: string[];
  };
}

export interface GenerationReport {
  timestamp: string;
  specification: string;
  outputPath: string;
  filesGenerated: number;
  structureCreated: string[];
  dependencies: string[];
  endpoints: string[];
  errors: string[];
  warnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  filesChecked: number;
  structure: ProjectStructure;
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  file: string;
  line?: number;
  message: string;
}

export interface ProjectStructure {
  hasPom: boolean;
  hasMainClass: boolean;
  hasControllers: boolean;
  hasServices: boolean;
  hasRepositories: boolean;
  hasTests: boolean;
  packagesFound: string[];
}

export interface JavaClass {
  name: string;
  package: string;
  type: 'class' | 'interface' | 'enum';
  annotations: string[];
  imports: string[];
  methods: JavaMethod[];
  fields: JavaField[];
}

export interface JavaMethod {
  name: string;
  returnType: string;
  parameters: JavaParameter[];
  annotations: string[];
  visibility: 'public' | 'private' | 'protected' | 'package';
}

export interface JavaParameter {
  name: string;
  type: string;
  annotations: string[];
}

export interface JavaField {
  name: string;
  type: string;
  annotations: string[];
  visibility: 'public' | 'private' | 'protected' | 'package';
}

export interface SpringBootProject {
  name: string;
  basePackage: string;
  database: string;
  port: number;
  dependencies: string[];
  profiles: string[];
}