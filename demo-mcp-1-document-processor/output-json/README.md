# Carpeta de Salida JSON

Esta carpeta contiene los archivos JSON generados por el MCP a partir de las especificaciones técnicas de Excel.

## Estructura del JSON Generado

```json
{
  "metadata": {
    "sourceFile": "nombre-archivo-excel.xlsx",
    "processedAt": "2025-07-16T10:30:00.000Z",
    "version": "1.0.0"
  },
  "microservice": {
    "name": "user-management-service",
    "description": "Servicio para gestión de usuarios",
    "version": "1.0.0",
    "port": 3001,
    "team": "Backend Team",
    "repository": "https://github.com/company/user-service"
  },
  "architecture": {
    "pattern": "hexagonal",
    "layers": ["controller", "service", "repository"],
    "database": "postgresql",
    "framework": "spring-boot"
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/users",
      "description": "Obtener lista de usuarios",
      "parameters": [],
      "responses": [
        {
          "status": 200,
          "description": "Lista de usuarios obtenida exitosamente"
        }
      ]
    }
  ],
  "integrations": [
    {
      "name": "user-database",
      "type": "database",
      "connection": "postgresql://localhost:5432/users",
      "description": "Base de datos principal de usuarios"
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

## Uso de estos archivos

Los archivos JSON generados aquí servirán como insumo para el siguiente MCP que generará el código del microservicio.
