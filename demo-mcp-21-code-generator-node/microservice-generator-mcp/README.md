# Microservice Generator MCP

Un Model Context Protocol (MCP) para generar microservicios Node.js/TypeScript completos basado en especificaciones JSON y patrones de arquitectura de referencia.

## 🎯 Características

- **Análisis inteligente** de especificaciones JSON y repositorios de referencia
- **Generación automática** de microservicios con arquitectura limpia
- **Soporte completo** para NestJS, TypeORM/Mongoose, testing y Docker
- **Integración con servicios legacy** mediante adapters auto-generados
- **Validación automática** del código generado
- **Reportes detallados** de generación y patrones aplicados

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- TypeScript conocimiento básico

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd microservice-generator-mcp

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build
```

## 📁 Estructura de Entrada

El MCP espera una carpeta `input/` con la siguiente estructura:

```
input/
├── specifications/
│   └── microservice-spec.json    # Especificación del microservicio
└── reference-repos/
    ├── MSTemplateNestJs/          # Repositorio de referencia 1
    ├── MSAbCaAlarFeaturesETL/     # Repositorio de referencia 2
    └── MSPrChValGenerate/         # Más repositorios...
```

## 📤 Estructura de Salida

El código generado se almacena en `output/`:

```
output/
├── [microservice-name]/          # Proyecto completo generado
│   ├── src/
│   │   ├── domain/              # Entidades, casos de uso, repos
│   │   ├── infrastructure/      # Base de datos, web, external
│   │   ├── application/         # Config, middlewares, validators
│   │   └── shared/              # Errores, utilidades
│   ├── tests/                   # Unit, integration, e2e
│   ├── docs/                    # API y arquitectura
│   ├── docker/                  # Dockerfile, compose
│   ├── .github/workflows/       # CI/CD
│   └── package.json             # Configuración completa
└── generation-report.json        # Reporte detallado
```

## 🛠️ Comandos del MCP

### 1. `analyze-input`
Analiza la carpeta input y extrae patrones de los repositorios de referencia.

```json
{
  "inputPath": "c:/path/to/input"
}
```

### 2. `generate-microservice`
Genera el microservicio completo en la carpeta output.

```json
{
  "inputPath": "c:/path/to/input",
  "outputPath": "c:/path/to/output"
}
```

### 3. `validate-output`
Valida el código generado (compilación, estructura, tests).

```json
{
  "outputPath": "c:/path/to/output"
}
```

### 4. `get-patterns`
Retorna patrones identificados en repos de referencia.

```json
{
  "framework": "nestjs"  // opcional
}
```

### 5. `get-generation-status`
Retorna estado actual del generador.

```json
{}
```

## 📝 Formato de Especificación

El archivo `microservice-spec.json` debe seguir esta estructura:

```json
{
  "metadata": {
    "sourceFile": "string",
    "processedAt": "2025-07-21T10:30:00Z",
    "version": "1.0.0"
  },
  "microservice": {
    "name": "my-microservice",
    "description": "Descripción del microservicio",
    "version": "1.0.0",
    "port": 3001,
    "team": "mi-equipo",
    "repository": "https://github.com/org/repo",
    "summary": "Resumen del microservicio"
  },
  "database": "oracle|postgresql|mysql|mongodb",
  "endpoints": [
    {
      "method": "GET|POST|PUT|DELETE|PATCH",
      "path": "/api/v1/resource",
      "description": "Descripción del endpoint",
      "parameters": ["id", "type"],
      "responses": [
        {
          "status": 200,
          "description": "Success response"
        }
      ],
      "inputParameters": [
        {
          "name": "field1",
          "type": "String|Number|Boolean|Object",
          "required": true,
          "description": "Descripción del parámetro"
        }
      ]
    }
  ],
  "integrations": [
    {
      "name": "legacy-service",
      "type": "API",
      "legacyServices": [
        {
          "name": "legacy-api",
          "urls": {
            "QA": "https://qa.api.com",
            "PROD": "https://prod.api.com"
          },
          "inputMapping": [
            {
              "microserviceField": "userId",
              "legacyField": "user_id",
              "type": "String",
              "required": true
            }
          ],
          "outputMapping": [
            {
              "legacyField": "result_data",
              "microserviceField": "resultData",
              "type": "Object",
              "required": true
            }
          ]
        }
      ]
    }
  ],
  "security": {
    "authentication": "JWT",
    "authorization": "RBAC",
    "cors": true
  }
}
```

## 🏗️ Arquitectura Generada

El generador implementa Clean Architecture con:

### Capa de Dominio (`src/domain/`)
- **Entities**: Modelos de negocio puros
- **Use Cases**: Lógica de negocio específica
- **Repositories**: Interfaces para acceso a datos

### Capa de Infraestructura (`src/infrastructure/`)
- **Database**: Implementaciones de repositorios
- **Web**: Controllers, DTOs, guards
- **External**: Adapters para servicios legacy

### Capa de Aplicación (`src/application/`)
- **Config**: Configuraciones del framework
- **Middlewares**: Middleware personalizado
- **Validators**: Validación de entrada

### Capa Compartida (`src/shared/`)
- **Errors**: Manejo de errores centralizado
- **Utils**: Utilidades comunes

## 🧪 Testing

Genera automáticamente:

- **Tests unitarios** para casos de uso
- **Tests de integración** para componentes
- **Tests E2E** para endpoints completos
- **Configuración Jest** optimizada

## 🐳 Containerización

Incluye:

- **Dockerfile** multi-stage optimizado
- **docker-compose.yml** con base de datos
- **Health checks** configurados
- **Variables de entorno** documentadas

## 🔄 CI/CD

Genera pipeline de GitHub Actions con:

- **Linting** y formateo
- **Tests** con cobertura
- **Build** de Docker
- **Security scanning**
- **Deployment** automático

## 📊 Reporte de Generación

El archivo `generation-report.json` incluye:

```json
{
  "timestamp": "2025-07-21T10:30:00Z",
  "microservice_name": "my-microservice",
  "patterns_applied": [
    {
      "source_repo": "MSTemplateNestJs",
      "pattern": "clean-architecture",
      "files_influenced": ["src/domain/", "src/infrastructure/"]
    }
  ],
  "generated_files": {
    "total": 52,
    "by_category": {
      "source": 28,
      "tests": 18,
      "config": 4,
      "docs": 2
    }
  },
  "validation_results": {
    "typescript_compilation": "success",
    "tests_execution": "success - 18/18 passed",
    "coverage": "87%"
  },
  "next_steps": [
    "Configure environment variables",
    "Run 'npm install'",
    "Run 'npm test'"
  ]
}
```

## 🔧 Desarrollo

```bash
# Modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Linting
npm run lint

# Formateo
npm run format
```

## 📚 Ejemplos

### Generar microservicio básico:

1. Preparar carpeta input con especificación y repos de referencia
2. Ejecutar análisis: `analyze-input`
3. Generar código: `generate-microservice`
4. Validar resultado: `validate-output`

### Microservicio con Oracle y JWT:

La especificación automáticamente configura:
- TypeORM con driver Oracle
- JWT authentication middleware
- Docker con Oracle container
- Tests específicos para Oracle

## 🤝 Contribución

1. Fork el repositorio
2. Crear feature branch
3. Commit con mensaje descriptivo
4. Push a la branch
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🆘 Soporte

- **Issues**: GitHub Issues
- **Documentación**: `/docs`
- **Ejemplos**: `/examples`

---

**Generado con ❤️ por MCP Microservice Generator**
