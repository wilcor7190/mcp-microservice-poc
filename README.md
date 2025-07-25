# MCP Microservice Proof of Concept

> Demostración completa de un pipeline de desarrollo de microservicios usando Model Context Protocol (MCP)

## 🎯 Descripción del Proyecto

Este repositorio contiene una suite completa de MCPs (Model Context Protocol) que forman un pipeline de desarrollo de microservicios automatizado. Los MCPs trabajan en conjunto para procesar especificaciones, generar código y validar estándares de desarrollo.

## 🏗️ Arquitectura del Sistema

### Pipeline de Desarrollo Automatizado
```
Excel/Especificaciones → Procesamiento → Selección Tecnológica → Generación de Código → Validación de Estándares
```

### Componentes Principales

| Componente | Descripción | Tecnología |
|------------|-------------|------------|
| **demo-mcp-1-document-processor** | Procesa especificaciones Excel a JSON estructurado | Node.js/TypeScript |
| **demo-mcp-2-code-generatororequestador** | Orquestador central que coordina la generación | Node.js/TypeScript |
| **demo-mcp-21-code-generator-node** | Generador de microservicios Node.js/NestJS | Node.js/TypeScript |
| **demo-mcp-22-code-generator-java** | Generador de microservicios Spring Boot | Node.js → Java |
| **demo-mcp-3-standards-validatororquestador** | Orquestador de validación de estándares | Node.js/TypeScript |
| **demo-mcp-3-standards-validator_nodejs** | Validador específico para proyectos Node.js | Node.js/TypeScript |
| **demo-mcp-3-standards-validator_java** | Validador específico para proyectos Java | Node.js/TypeScript |

## 🚀 Características Principales

### ✨ Procesamiento de Documentos
- Conversión de especificaciones Excel (.xlsx, .xls, .csv) a JSON estructurado
- Soporte para múltiples hojas (Servicio, Endpoints, Integraciones)
- Validación automática de formato y estructura

### 🎯 Generación Inteligente de Código
- **Selección automática de tecnología** basada en requerimientos
- **Node.js/NestJS**: Arquitectura limpia con patrones hexagonales
- **Spring Boot/Java**: Patrones empresariales y mejores prácticas
- Soporte para múltiples bases de datos (Oracle, PostgreSQL, MySQL, MongoDB)

### 🔍 Validación Integral de Estándares
- **Seguridad**: Detección de vulnerabilidades, configuración segura
- **Calidad de Código**: ESLint, TypeScript strict mode, patrones arquitecturales
- **Testing**: Cobertura, pruebas unitarias/integración, mocking
- **Rendimiento**: Optimización de base de datos, caché, pools de conexión
- **Documentación**: APIs, arquitectura, deployment

## 📋 Requisitos Previos

- Node.js 18+ 
- TypeScript 5+
- Git
- Claude Desktop (para integración MCP)

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/wilcor7190/mcp-microservice-poc.git
cd mcp-microservice-poc
```

### 2. Instalar Dependencias (cada proyecto)
```bash
# Procesador de documentos
cd demo-mcp-1-document-processor
npm install && npm run build

# Orquestador principal
cd ../demo-mcp-2-code-generatororequestador  
npm install && npm run build

# Generador Node.js
cd ../demo-mcp-21-code-generator-node/microservice-generator-mcp
npm install && npm run build

# Generador Java
cd ../../demo-mcp-22-code-generator-java
npm install && npm run build

# Validadores
cd ../demo-mcp-3-standards-validatororquestador
npm install && npm run build

cd ../demo-mcp-3-standards-validator_nodejs
npm install && npm run build

cd ../demo-mcp-3-standards-validator_java
npm install && npm run build
```

### 3. Configuración de Claude Desktop
Ver archivos `claude_desktop_config.json` en cada proyecto para integración con Claude Desktop.

## 🎮 Uso Rápido

### Generación Completa de Microservicio
```bash
# 1. Procesar especificación Excel
cd demo-mcp-1-document-processor
npx tsx demo-simple.ts

# 2. Generar microservicio
cd ../demo-mcp-2-code-generatororequestador
npm run dev
# Usar el MCP para generar con la especificación procesada

# 3. Validar estándares
cd ../demo-mcp-3-standards-validatororquestador
npm run dev
# Usar el MCP para validar el microservicio generado
```

### Scripts de Demostración
Cada proyecto incluye scripts de prueba:
- `demo-simple.ts` - Demostración básica
- `test-*.mjs` - Pruebas directas de MCP
- `*.bat` - Scripts de Windows para inicio rápido

## 📊 Resultados Esperados

### Salidas del Pipeline
- **Especificaciones JSON**: Estructuras listas para generación
- **Microservicios completos**: Con arquitectura limpia y patrones
- **Reportes de validación**: Scores de compliance y recomendaciones
- **Documentación automática**: APIs, arquitectura, deployment

### Estructura de Salida
```
output/
├── microservice-name/
│   ├── src/
│   ├── tests/
│   ├── docs/
│   ├── docker/
│   └── README.md
└── reports/
    ├── generation-report.json
    └── validation-report.json
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**wilcor7190**
- GitHub: [@wilcor7190](https://github.com/wilcor7190)

## 🙏 Agradecimientos

- Anthropic por Claude y el SDK de MCP
- Comunidad de NestJS y Spring Boot
- Contribuidores de TypeScript y Node.js

---

### 📚 Documentación Adicional

Para información detallada sobre cada componente, consulta:
- [CLAUDE.md](CLAUDE.md) - Guía completa para Claude Code
- README.md individual de cada proyecto
- Archivos de configuración y ejemplos en cada directorio