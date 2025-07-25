# MCP Document Processor para Especificaciones Técnicas de Microservicios

Este MCP (Model Context Protocol) procesa archivos Excel que contienen especificaciones técnicas de microservicios y genera archivos JSON estructurados que sirven como insumo para la generación automática de código.

## 🎯 Objetivo

- **Entrada**: Archivos Excel (.xlsx) con especificaciones técnicas de microservicios
- **Salida**: Archivos JSON estructurados con toda la información del microservicio
- **Propósito**: Automatizar la extracción de especificaciones para generar código automáticamente

## 📁 Estructura del Proyecto

```
demo-mcp-1-document-processor/
├── src/
│   └── index.ts              # Código principal del MCP
├── input-specifications/     # 📥 Carpeta para archivos Excel de entrada
│   ├── README.md            # Documentación del formato esperado
│   ├── user-management-service-spec.xlsx
│   └── product-catalog-service-spec.xlsx
├── output-json/             # 📤 Carpeta para archivos JSON generados
│   └── README.md            # Documentación del formato de salida
├── package.json
├── tsconfig.json
├── demo-simple.ts           # Script de demostración
└── create-examples.ts       # Script para crear archivos de ejemplo
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Compilar el proyecto
```bash
npm run build
```

### 3. Crear archivos de ejemplo (opcional)
```bash
npx tsx create-examples.ts
```

### 4. Ejecutar demostración
```bash
npx tsx demo-simple.ts
```

## 📊 Formato de Archivo Excel Esperado

### Hoja 1: "Servicio" - Información General
| Servicio | Descripción | Versión | Puerto | Equipo | Repositorio |
|----------|-------------|---------|--------|--------|-------------|
| user-management-service | Microservicio para gestión de usuarios | 1.0.0 | 3001 | Backend Team | https://github.com/company/user-service |

### Hoja 2: "Endpoints" - APIs REST
| Método | Ruta | Descripción | Parámetros | Respuesta |
|--------|------|-------------|------------|-----------|
| GET | /api/v1/users | Obtener lista de usuarios | page:int;size:int | 200: Lista de usuarios |
| POST | /api/v1/users | Crear nuevo usuario | body: UserCreateDTO | 201: Usuario creado |

### Hoja 3: "Integraciones" - Sistemas Externos
| Sistema | Tipo | Conexión | Descripción | Configuración |
|---------|------|----------|-------------|---------------|
| user-database | database | postgresql://localhost:5432/users | Base de datos principal | pool-size: 10 |
| auth-service | rest-api | https://auth.company.com/v1 | Servicio de autenticación | timeout: 5000ms |

## 🔧 Uso del MCP

### Herramientas Disponibles

#### 1. `process_microservice_specification`
Procesa un archivo Excel específico y genera el JSON correspondiente.

**Parámetros:**
- `filePath`: Ruta al archivo Excel (.xlsx)

**Ejemplo:**
```
Herramienta: process_microservice_specification
Parámetros: { "filePath": "input-specifications/user-management-service-spec.xlsx" }
```

#### 2. `analyze_input_folder`
Analiza todos los archivos disponibles en la carpeta `input-specifications`.

**Ejemplo:**
```
Herramienta: analyze_input_folder
Parámetros: {}
```

## 📤 Formato de JSON Generado

```json
{
  "metadata": {
    "sourceFile": "user-management-service-spec.xlsx",
    "processedAt": "2025-07-16T10:30:00.000Z",
    "version": "1.0.0"
  },
  "microservice": {
    "name": "user-management-service",
    "description": "Microservicio para gestión de usuarios",
    "version": "1.0.0",
    "port": 3001,
    "team": "Backend Team",
    "repository": "https://github.com/company/user-service"
  },
  "architecture": {
    "pattern": "hexagonal",
    "layers": ["controller", "service", "repository", "domain"],
    "database": "postgresql",
    "framework": "spring-boot"
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/users",
      "description": "Obtener lista de usuarios",
      "parameters": ["page:int", "size:int"],
      "responses": [
        {
          "status": 200,
          "description": "Lista de usuarios obtenida"
        }
      ]
    }
  ],
  "integrations": [
    {
      "name": "user-database",
      "type": "database",
      "connection": "postgresql://localhost:5432/users",
      "description": "Base de datos principal",
      "configuration": "pool-size: 10"
    }
  ],
  "security": {
    "authentication": "JWT",
    "authorization": "RBAC",
    "cors": true
  },
  "configuration": {
    "environment": ["dev", "test", "prod"],
    "secrets": ["db-password", "jwt-secret"],
    "configMaps": ["app-config"]
  }
}
```

## 🔄 Flujo de Trabajo

1. **📥 Preparación**: Coloca tus archivos Excel en `input-specifications/`
2. **🔧 Procesamiento**: Ejecuta el MCP con la herramienta `process_microservice_specification`
3. **📤 Resultado**: Los JSON se generan en `output-json/`
4. **🚀 Siguiente Paso**: Usa los JSON como entrada para el MCP de generación de código

## 🛠 Funcionalidades

### ✅ Tipos de Archivo Soportados
- **.xlsx** - Excel (recomendado)
- **.xls** - Excel legacy
- **.csv** - Formato CSV simple

### ✅ Detección Automática
- **Framework**: Detecta el framework según el nombre del servicio
- **Base de Datos**: Identifica el tipo de BD desde las integraciones
- **Patrón Arquitectónico**: Asigna patrones según el tipo de servicio

### ✅ Validaciones
- Verificación de estructura de archivos
- Validación de datos obligatorios
- Asignación de valores por defecto

## 🐛 Solución de Problemas

### Error: "Tipo de archivo no soportado"
- Verifica que el archivo tenga extensión .xlsx o .xls
- Asegúrate de que el archivo no esté corrupto

### Error: "No se pudo leer el archivo"
- Verifica que la ruta del archivo sea correcta
- Asegúrate de que el archivo no esté abierto en Excel
- Verifica permisos de lectura del archivo

### JSON incompleto
- Revisa que el Excel tenga las hojas con los nombres correctos
- Verifica que las columnas estén en el orden esperado
- Asegúrate de que la primera fila contenga los headers

## 📈 Roadmap

- [ ] Soporte para archivos Word (.docx)
- [ ] Validación de esquemas JSON
- [ ] Interfaz web para visualización
- [ ] Soporte para múltiples hojas de endpoints
- [ ] Exportación a otros formatos (YAML, XML)

## 🤝 Contribución

Este MCP es parte de una cadena de herramientas para generación automática de microservicios. El JSON generado aquí se utiliza como entrada para el siguiente MCP que genera el código fuente.

## 📄 Licencia

Este proyecto es parte de la demostración de MCP para procesamiento de documentos técnicos.
