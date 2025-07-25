# Test del MCP Orchestrator

## Comandos de Prueba

### 1. Análisis y Selección
```bash
{
  "method": "analyze-and-select",
  "params": {
    "inputPath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\input"
  }
}
```

### 2. Comparación de Tecnologías
```bash
{
  "method": "compare-technologies", 
  "params": {
    "specPath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\input\\specification\\microservice-spec.json"
  }
}
```

### 3. Estado de Orquestación
```bash
{
  "method": "get-orchestration-status",
  "params": {}
}
```

### 4. Generar Microservicio (Node.js)
```bash
{
  "method": "generate-microservice",
  "params": {
    "technology": "nodejs",
    "specificationPath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\input\\specification\\microservice-spec.json",
    "referencePath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\input\\reference-repos",
    "outputPath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\output"
  }
}
```

### 5. Generar Microservicio (Spring Boot)
```bash
{
  "method": "generate-microservice",
  "params": {
    "technology": "springboot",
    "specificationPath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\input\\specification\\microservice-spec.json",
    "referencePath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\input\\reference-repos",
    "outputPath": "c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\output"
  }
}
```

## Estructura de Respuesta Esperada

### Análisis y Selección
```json
{
  "success": true,
  "analysis": {
    "microserviceName": "mscusbillperiodquerym-service",
    "complexity": "medium",
    "databaseType": "oracle", 
    "endpointsCount": 1,
    "integrationsCount": 1
  },
  "repositoriesFound": {
    "nodejs": 0,
    "springboot": 0
  },
  "recommendation": "Recommended technology: springboot (confidence: 92%)",
  "timestamp": "2025-07-21T..."
}
```

### Comparación de Tecnologías
```json
{
  "success": true,
  "comparison": {
    "nodejs": {
      "compatibility": 85,
      "strengths": ["Fast development", "Rich ecosystem"],
      "weaknesses": ["Manual Oracle setup"],
      "estimatedTime": "15-20 minutos",
      "filesGenerated": 52
    },
    "springboot": {
      "compatibility": 92,
      "strengths": ["Enterprise patterns", "Oracle support"],
      "weaknesses": ["Higher complexity"],
      "estimatedTime": "20-25 minutos", 
      "filesGenerated": 68
    },
    "recommendation": {
      "technology": "springboot",
      "confidence": 92,
      "reasoning": ["Oracle database support", "Enterprise patterns"]
    }
  }
}
```

## Configuración para Claude Desktop

Agrega al archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "microservice-orchestrator": {
      "command": "node",
      "args": ["c:\\MCP\\demo\\demo-mcp-2-code-generatororequestador\\build\\index.js"]
    }
  }
}
```

## Comandos de Claude

Después de configurar, puedes usar estos comandos en Claude Desktop:

1. **"Analiza mi especificación de microservicio"** - Ejecutará el análisis automáticamente
2. **"Compara Node.js vs Spring Boot para mi proyecto"** - Mostrará comparación detallada
3. **"Genera un microservicio con Spring Boot"** - Iniciará el proceso de generación
4. **"¿Cuál es el estado del orchestrator?"** - Verificará conexiones y estado del sistema

## Notas Importantes

- El orchestrator requiere que los MCPs especializados estén disponibles en las rutas configuradas
- Las rutas de ejemplo apuntan a los MCPs de Node.js y Spring Boot específicos
- Los repositorios de referencia deben colocarse en las carpetas correspondientes antes de la generación
- El sistema genera reportes detallados de todo el proceso de orquestación
