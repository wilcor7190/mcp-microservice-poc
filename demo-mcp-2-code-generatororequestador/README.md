# 🚀 MCP Microservice Orchestrator

Un servidor MCP (Model Context Protocol) avanzado para la generación automatizada de microservicios, que permite seleccionar entre tecnologías Node.js y Spring Boot basándose en análisis inteligente de especificaciones técnicas.

## 📋 Características Principales

- **🔍 Análisis Inteligente**: Analiza especificaciones técnicas y repositorios de referencia
- **🎯 Selección de Tecnología**: Compara y recomienda entre Node.js y Spring Boot
- **🏗️ Generación Automatizada**: Coordina la generación de microservicios completos
- **📊 Reportes Detallados**: Genera reportes completos de orquestación
- **🔧 Compatible con Windows**: Optimizado para entornos Windows con paths absolutos
- **Reportes Detallados**: Documentación completa del proceso

## Herramientas Disponibles

### `analyze-and-select`
Analiza la especificación del microservicio y los repositorios de referencia, proporcionando recomendaciones de tecnología.

**Parámetros:**
- `inputPath`: Ruta al directorio de entrada con especificación y repositorios

### `generate-microservice`
Genera un microservicio completo usando la tecnología especificada.

**Parámetros:**
- `technology`: Tecnología a usar ('nodejs' | 'springboot')
- `specificationPath`: Ruta al archivo de especificación
- `referencePath`: Ruta a los repositorios de referencia
- `outputPath`: Ruta donde se almacenará el microservicio generado
- `skipValidation`: Omitir pasos de validación (opcional)
- `generateDocs`: Generar documentación adicional (opcional)

### `compare-technologies`
Compara las tecnologías Node.js y Spring Boot para la especificación dada.

**Parámetros:**
- `specPath`: Ruta al archivo de especificación del microservicio

### `get-orchestration-status`
Obtiene el estado actual del sistema de orquestación y las conexiones MCP.

## Estructura del Proyecto

```
src/
├── core/                    # Orchestrator principal
├── analyzers/              # Analizadores de especificaciones y repositorios
├── selectors/              # Selector interactivo de tecnología
├── managers/               # Gestores de transferencia de archivos
├── executors/              # Ejecutores de MCPs especializados
├── types/                  # Definiciones de tipos TypeScript
└── utils/                  # Utilidades auxiliares

input/
├── specification/          # Especificaciones de microservicios
└── reference-repos/        # Repositorios de referencia
    ├── nodejs-repos/       # Repositorios Node.js
    └── springboot-repos/   # Repositorios Spring Boot

output/                     # Microservicios generados

config/                     # Archivos de configuración
```

## Configuración

El orchestrator se conecta con MCPs especializados ubicados en:

- **Node.js MCP**: `C:\MCP\demo\demo-mcp-21-code-generator-node`
- **Spring Boot MCP**: `C:\MCP\demo\demo-mcp-22-code-generator-java`

## Flujo de Trabajo

1. **Análisis**: Procesa especificaciones y evalúa repositorios de referencia
2. **Recomendación**: Sugiere la mejor tecnología basada en el análisis
3. **Selección**: Permite al usuario elegir la tecnología preferida
4. **Transferencia**: Copia archivos al MCP especializado correspondiente
5. **Generación**: Ejecuta el MCP especializado seleccionado
6. **Consolidación**: Recupera y organiza los resultados generados
7. **Documentación**: Genera reportes y documentación completa

## Uso con Claude Desktop

Agrega la configuración al archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "microservice-orchestrator": {
      "command": "node",
      "args": ["C:\\PATH\\TO\\PROJECT\\build\\index.js"]
    }
  }
}
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/wilcor7190/mcp-microservice-orchestrator.git
cd mcp-microservice-orchestrator

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar el servidor MCP
npm start
```

## Tecnologías Soportadas

### Node.js + TypeScript
- Express.js o Fastify
- Clean Architecture
- Jest Testing
- Docker
- Oracle drivers

### Spring Boot + Java
- Spring Data JPA
- Spring Security
- Maven/Gradle
- JUnit 5
- Docker
- Oracle connectivity

## Reportes Generados

- **orchestration-report.json**: Reporte completo del proceso
- **technology-analysis.json**: Análisis detallado de tecnologías
- **generation-choices.md**: Decisiones tomadas durante la generación

## Estructura de Entrada Esperada

```
input/
├── specification/
│   └── microservice-spec.json    # Especificación del microservicio
└── reference-repos/
    ├── nodejs-repos/             # Repositorios de referencia Node.js
    │   ├── express-oracle-integration/
    │   ├── typescript-clean-arch/
    │   └── nodejs-legacy-adapter/
    └── springboot-repos/         # Repositorios de referencia Spring Boot
        ├── spring-oracle-jpa/
        ├── springboot-clean-arch/
        └── legacy-integration-spring/
```

## Arquitectura del Sistema

El MCP Orchestrator actúa como punto de entrada único, coordinando la generación de microservicios y proporcionando una interfaz unificada para la selección de tecnologías y el monitoreo de procesos.

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio en [GitHub](https://github.com/wilcor7190/mcp-microservice-orchestrator)
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Implementa los cambios y añade tests
4. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
