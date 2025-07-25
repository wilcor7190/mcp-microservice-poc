# MCP Java/Spring Boot Code Generator

Un servidor MCP (Model Context Protocol) escrito en Node.js/TypeScript que genera microservicios completos en Java/Spring Boot basándose en especificaciones JSON.

## 🚀 Características

- **MCP Server en Node.js**: Compatible con Claude Desktop
- **Generación Java/Spring Boot**: Crea microservicios completos con arquitectura limpia
- **Múltiples Bases de Datos**: Soporte para Oracle, PostgreSQL, MySQL
- **Análisis de Patrones**: Extrae patrones de repositorios Java de referencia
- **Templates Handlebars**: Sistema de plantillas flexible y mantenible
- **Validación Automática**: Valida el código Java generado

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn
- Claude Desktop (para usar el MCP)

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Compilar el proyecto:
```bash
npm run build
```

## ⚙️ Configuración en Claude Desktop

Agrega la siguiente configuración a tu archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "java-generator": {
      "command": "node",
      "args": ["C:/MCP/demo/demo-mcp-22-code-generator-java/dist/index.js"],
      "cwd": "C:/MCP/demo/demo-mcp-22-code-generator-java"
    }
  }
}
```

## 📁 Estructura del Proyecto

```
├── src/                        # Código fuente TypeScript
│   ├── analyzers/             # Analizadores de especificaciones y repositorios
│   ├── generators/            # Generador principal de Spring Boot
│   ├── templates/             # Motor de plantillas Handlebars
│   ├── types/                 # Tipos TypeScript
│   ├── utils/                 # Utilidades
│   └── index.ts               # Punto de entrada del MCP server
├── dist/                      # Código compilado
├── input/                     # Archivos de entrada
│   ├── specifications/        # Especificaciones JSON
│   └── reference-repos/       # Repositorios Java de referencia
├── output/                    # 📤 MICROSERVICIOS GENERADOS
│   └── [nombre-microservicio]/ # Aquí se genera cada microservicio
└── package.json               # Configuración Node.js
```

## 🔧 Herramientas MCP Disponibles

### 1. `analyze-input`
Analiza la carpeta input y extrae patrones de repositorios Java de referencia.

**Parámetros:**
- `inputPath`: Ruta a la carpeta input

**Ejemplo:**
```
Analiza la carpeta input y extrae patrones de los repositorios de referencia
```

### 2. `generate-microservice`
Genera el microservicio Java/Spring Boot completo.

**Parámetros:**
- `specificationPath`: Ruta al archivo JSON de especificación
- `outputPath`: Ruta donde se generará el microservicio
- `packageName`: Nombre del paquete Java base (opcional)

**Ejemplo:**
```
Genera un microservicio basado en la especificación mscusbillperiodquerym-service-specification.json
```

**Resultado:** El microservicio se genera en `output/mscusbillperiodquerym-service/`

### 3. `get-patterns`
Obtiene los patrones arquitectónicos identificados.

### 4. `validate-output`
Valida el código Java generado.

### 5. `get-generation-status`
Obtiene el estado del proceso de generación.

## 📊 Estructura del Microservicio Generado

```
microservicio-generado/
├── pom.xml                     # Configuración Maven
├── README.md                   # Documentación del proyecto
├── docker/
│   └── Dockerfile             # Contenedor Docker
├── docker-compose.yml         # Orquestación local
├── k8s/                       # Manifiestos Kubernetes
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/service/
│   │   │       ├── application/        # Configuración
│   │   │       ├── domain/            # Lógica de negocio
│   │   │       │   ├── entities/      # Entidades JPA
│   │   │       │   ├── repositories/  # Repositorios
│   │   │       │   └── services/      # Servicios de dominio
│   │   │       ├── infrastructure/    # Infraestructura
│   │   │       │   ├── config/        # Configuración
│   │   │       │   ├── persistence/   # Adaptadores BD
│   │   │       │   └── web/          # Controllers y DTOs
│   │   │       └── shared/           # Componentes compartidos
│   │   └── resources/
│   │       ├── application.yml       # Configuración principal
│   │       ├── application-dev.yml   # Perfil desarrollo
│   │       └── application-prod.yml  # Perfil producción
│   └── test/
│       └── java/                     # Tests unitarios e integración
└── docs/                            # Documentación adicional
```

## 🏗️ Arquitectura Implementada

### Clean Architecture
- **Domain Layer**: Entidades, repositorios y servicios de dominio
- **Application Layer**: Casos de uso y configuración
- **Infrastructure Layer**: Adaptadores para BD, web y servicios externos
- **Shared Layer**: Utilidades y constantes compartidas

### Tecnologías Incluidas
- **Spring Boot 3.3.7** con Java 17
- **Spring Data JPA** para persistencia
- **Spring Security** (si se especifica en la configuración)
- **Spring Boot Actuator** para monitoring
- **Swagger/OpenAPI** para documentación de API
- **Lombok** para reducir boilerplate
- **JUnit 5** para testing

### Bases de Datos Soportadas
- **Oracle**: Con driver ojdbc8
- **PostgreSQL**: Con driver nativo
- **MySQL**: Con mysql-connector-java
- **MongoDB**: Con Spring Data MongoDB

## 📝 Formato de Especificación de Entrada

El MCP acepta especificaciones en formato JSON:

```json
{
  "microservice": {
    "name": "nombre-del-microservicio",
    "description": "Descripción del microservicio",
    "port": 8080
  },
  "database": "oracle",
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/resource",
      "description": "Descripción del endpoint",
      "parameters": ["param1", "param2"],
      "responses": [
        {"status": 200, "description": "Éxito"}
      ]
    }
  ],
  "integrations": [
    {
      "name": "database-integration",
      "type": "Base de datos",
      "connection": "connection-string",
      "description": "Descripción de la integración"
    }
  ]
}
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén disponibles)
npm test

# Ejecutar en modo desarrollo
npm run dev
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Asegúrate de haber ejecutado `npm run build`
- Verifica que todas las dependencias estén instaladas

### Error: "Path not found" en Claude Desktop
- Verifica que las rutas en `claude_desktop_config.json` sean absolutas
- Asegúrate de que el archivo `dist/index.js` exista

### Microservicio generado no compila
- Revisa los logs del MCP en la consola de Claude Desktop
- Verifica que la especificación JSON tenga el formato correcto
- Ejecuta la validación con la herramienta `validate-output`

## 📤 Ubicación de los Microservicios Generados

**Los microservicios se generan en la carpeta `output/`:**

```
C:\MCP\demo\demo-mcp-22-code-generator-java\output\[nombre-microservicio]\
```

### Ejemplo de generación:
1. **Entrada**: `input/specifications/mscusbillperiodquerym-service-specification.json`
2. **Salida**: `output/mscusbillperiodquerym-service/` (microservicio Java completo)

### Contenido generado:
- **Código Java/Spring Boot** con arquitectura limpia
- **pom.xml** con dependencias configuradas
- **Dockerfile** y **docker-compose.yml** 
- **Manifiestos Kubernetes**
- **Tests unitarios e integración**
- **Documentación** del proyecto

## 🔄 Flujo de Trabajo

1. **Preparar**: Coloca especificaciones JSON en `input/specifications/`
2. **Analizar**: Usa `analyze-input` para extraer patrones
3. **Generar**: Usa `generate-microservice` para crear el código
4. **📂 Navegar**: `cd output/nombre-microservicio`
5. **Validar**: Usa `validate-output` para verificar la calidad
6. **Compilar**: Ejecuta `mvn clean compile` en el proyecto generado

## 📄 Licencia

MIT License