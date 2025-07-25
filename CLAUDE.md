# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains multiple MCP (Model Context Protocol) demonstration projects that form a complete microservice development pipeline. The MCPs work together to process specifications, generate code, and validate standards.

## Project Structure

The repository contains several interconnected MCP demo projects:

- **demo-mcp-1-document-processor**: Processes Excel specifications into structured JSON
- **demo-mcp-2-code-generatororequestador**: Orchestrator that coordinates between Node.js and Spring Boot generators
- **demo-mcp-21-code-generator-node**: Generates Node.js/NestJS microservices
- **demo-mcp-22-code-generator-java**: Generates Spring Boot microservices (Node.js MCP that generates Java code)
- **demo-mcp-3-standards-validatororquestador**: Orchestrator that detects technology and delegates validation
- **demo-mcp-3-standards-validator_nodejs**: Validates Node.js/NestJS projects against standards
- **demo-mcp-3-standards-validator_java**: Validates Java/Spring Boot projects against standards

## Common Commands

### Document Processor (demo-mcp-1-document-processor)
```bash
cd demo-mcp-1-document-processor
npm install
npm run build
npm run dev                    # Run MCP server in development
npx tsx demo-simple.ts         # Run demo
npx tsx create-examples.ts     # Create example files
```

### Code Generator Orchestrator (demo-mcp-2-code-generatororequestador)
```bash
cd demo-mcp-2-code-generatororequestador
npm install
npm run build
npm run dev                    # Run MCP server
```

### Node.js Generator (demo-mcp-21-code-generator-node)
```bash
cd demo-mcp-21-code-generator-node/microservice-generator-mcp
npm install
npm run build
node test-generation.mjs      # Test generation locally
node test-mcp-direct.mjs      # Test MCP directly
```

### Java Generator (demo-mcp-22-code-generator-java)
```bash
cd demo-mcp-22-code-generator-java
npm install
npm run build
npm run dev                    # Run Node.js MCP that generates Java/Spring Boot code
```

### Standards Validation System
#### Orchestrator (demo-mcp-3-standards-validatororquestador)
```bash
cd demo-mcp-3-standards-validatororquestador
npm install
npm run build
npm run dev                    # Run orchestrator MCP
```

#### Node.js Validator (demo-mcp-3-standards-validator_nodejs)
```bash
cd demo-mcp-3-standards-validator_nodejs
npm install
npm run build
npm run dev                    # Run Node.js standards validator MCP
```

#### Java Validator (demo-mcp-3-standards-validator_java)
```bash
cd demo-mcp-3-standards-validator_java
npm install
npm run build
npm run dev                    # Run Java standards validator MCP
```

## Architecture Overview

### MCP Pipeline Flow
1. **Document Processing**: Excel specifications → Structured JSON
2. **Technology Selection**: Orchestrator analyzes requirements and selects Node.js vs Spring Boot
3. **Code Generation**: Specialized generators create complete microservices
4. **Standards Validation**: 3-MCP validation system with orchestrator and specialized validators
   - Orchestrator detects technology and delegates to appropriate validator
   - Node.js validator checks NestJS/TypeScript standards (security, testing, code quality)
   - Java validator checks Spring Boot/Java standards (architecture, performance, documentation)

### Key Components

#### Document Processor
- Processes Excel files with multiple sheets (Servicio, Endpoints, Integraciones)
- Generates structured JSON specifications following microservice patterns
- Supports multiple file formats (.xlsx, .xls, .csv)

#### Orchestrator
- Central coordination hub between different technology stacks
- Implements clean architecture with analyzers, selectors, and executors
- Connects to external MCP servers at specific Windows paths
- Uses TypeScript with strict mode and proper error handling

#### Code Generators
- **Node.js Generator**: Creates NestJS-based microservices with Clean Architecture
- **Java Generator**: Creates Spring Boot microservices following enterprise patterns
- Both support multiple databases (Oracle, PostgreSQL, MySQL, MongoDB)
- Generate complete project structure including tests, deployment configs, and documentation

#### Standards Validation System
- **Orchestrator**: Detects project technology and routes validation to appropriate MCP
- **Node.js Validator**: Comprehensive validation of NestJS/TypeScript projects
  - Security: npm audit, secrets detection, Helmet, CORS, input validation
  - Testing: Jest coverage, unit/integration tests, mocking patterns
  - Code Quality: ESLint, TypeScript strict mode, architecture patterns
- **Java Validator**: Complete validation of Spring Boot/Java projects
  - Security: dependency vulnerabilities, Spring Security, input validation
  - Architecture: package structure, dependency injection, exception handling
  - Performance: database optimization, caching, connection pools, monitoring
- Generates detailed compliance reports with scores and recommendations

### File System Architecture
- **input/**: Contains specifications and reference repositories
- **output/**: Generated microservices and reports
- **src/**: Source code organized by layers (analyzers, generators, validators)
- **dist/**: Compiled TypeScript code

## Development Guidelines

### MCP Server Development
- All MCP servers use the @modelcontextprotocol/sdk
- Log to stderr only (never stdout) to avoid corrupting JSON-RPC messages
- Use absolute Windows paths for file operations
- Implement proper error handling for file operations and external connections

### Code Generation Patterns
- Follow Clean Architecture with distinct layers
- Generate hexagonal architecture patterns
- Include proper TypeScript types and strict mode compliance
- Implement comprehensive testing structure

### Windows Environment Specifics
- Use absolute paths starting with drive letters (C:\)
- MCP servers are located at specific paths:
  - Node.js Generator: `C:\MCP\demo\demo-mcp-21-code-generator-node`
  - Java Generator: `C:\MCP\demo\demo-mcp-22-code-generator-java`
  - Validation Orchestrator: `C:\MCP\demo\demo-mcp-3-standards-validatororquestador`
  - Node.js Validator: `C:\MCP\demo\demo-mcp-3-standards-validator_nodejs`
  - Java Validator: `C:\MCP\demo\demo-mcp-3-standards-validator_java`

## Testing and Validation

Each project includes specific testing mechanisms:
- Demo scripts for quick testing (`demo-simple.ts`, `demo-start.bat`)
- Direct MCP testing utilities
- Validation scripts for generated output
- Standards compliance checking

## Configuration Files

### Claude Desktop Integration
Projects include `claude_desktop_config.json` files for MCP integration:
```json
{
  "mcpServers": {
    "demo-name": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "cwd": "path/to/project"
    }
  }
}
```

### MCP Configuration
Projects use `mcp-config.json` for MCP-specific settings and orchestrator configurations in YAML format.