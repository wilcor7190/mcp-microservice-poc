# MCP Standards Validation Orchestrator

Orquestador MCP que recibe microservicios, detecta su tecnología automáticamente y delega la validación de estándares al MCP especializado correspondiente.

## 🎯 Objetivo

- **Detecta tecnología** automáticamente (Node.js, Java, .NET)
- **Delega validación** al MCP especializado según la tecnología
- **Genera reportes** consolidados de cumplimiento de estándares
- **Escalable** para agregar nuevas tecnologías fácilmente

## 🏗️ Arquitectura

```
📂 input/microservices/     # Microservicios a validar
├── microservicio-nodejs/
├── microservicio-java/
└── microservicio-dotnet/

📂 output/validation-reports/ # Reportes de validación generados

🔧 Detección Automática:
├── Node.js → demo-mcp-3-standards-validator_nodejs
├── Java    → demo-mcp-3-standards-validator_java
└── .NET    → demo-mcp-3-standards-validator_dotnet (futuro)
```

## 🛠️ Instalación

```bash
npm install
npm run build
```

## ⚙️ Configuración en Claude Desktop

```json
{
  "mcpServers": {
    "standards-orchestrator": {
      "command": "node",
      "args": ["C:/MCP/demo/demo-mcp-3-standards-validatororquestador/dist/index.js"],
      "cwd": "C:/MCP/demo/demo-mcp-3-standards-validatororquestador"
    }
  }
}
```

## 🔧 Herramientas MCP Disponibles

### 1. `validate-microservice`
Valida un microservicio completo contra estándares de desarrollo.

**Parámetros:**
- `projectPath`: Ruta al microservicio (absoluta)
- `standards`: Configuración de estándares (opcional)
- `outputPath`: Ruta para guardar reporte (opcional)

**Ejemplo:**
```
Valida el microservicio en input/microservices/mi-microservicio contra todos los estándares
```

### 2. `detect-technology`
Detecta la tecnología de un microservicio.

**Parámetros:**
- `projectPath`: Ruta al microservicio

**Ejemplo:**
```
Detecta qué tecnología usa el microservicio en input/microservices/mi-microservicio
```

### 3. `list-validators`
Lista todos los validadores MCP disponibles.

**Ejemplo:**
```
Muestra qué validadores están disponibles para cada tecnología
```

### 4. `validate-batch`
Valida múltiples microservicios en una carpeta.

**Parámetros:**
- `inputPath`: Carpeta con múltiples microservicios
- `outputPath`: Carpeta para reportes
- `standards`: Configuración de estándares (opcional)

**Ejemplo:**
```
Valida todos los microservicios en input/microservices/ y guarda reportes en output/validation-reports/
```

## 📊 Estándares Validados

### Configuración de Estándares
```json
{
  "security": true,      // Validación de seguridad
  "testing": true,       // Tests unitarios
  "coverage": true,      // Cobertura de código
  "codeQuality": true,   // Calidad de código
  "documentation": true, // Documentación
  "performance": true    // Aspectos de rendimiento
}
```

### Por Tecnología

#### Node.js/NestJS
- **Seguridad**: ESLint security rules, dependencias vulnerables
- **Testing**: Jest, cobertura mínima 80%
- **Calidad**: ESLint, Prettier, complejidad ciclomática
- **Documentación**: README, JSDoc, Swagger/OpenAPI

#### Java/Spring Boot
- **Seguridad**: SpotBugs, OWASP dependency check
- **Testing**: JUnit 5, cobertura mínima 80%
- **Calidad**: PMD, Checkstyle, SonarQube rules
- **Documentación**: JavaDoc, README, Swagger/OpenAPI

## 📤 Reportes de Validación

### Estructura del Reporte
```json
{
  "project": {
    "name": "mi-microservicio",
    "technology": "nodejs",
    "framework": "NestJS"
  },
  "overallScore": 85,
  "overallStatus": "PASSED",
  "categories": [
    {
      "name": "Security",
      "score": 90,
      "status": "PASSED",
      "rules": [...]
    }
  ],
  "recommendations": [
    {
      "priority": "HIGH",
      "category": "Testing",
      "title": "Aumentar cobertura de tests",
      "action": "Agregar tests para controllers",
      "impact": "Reduce riesgo de bugs en producción"
    }
  ],
  "summary": {
    "totalRules": 45,
    "passedRules": 38,
    "failedRules": 7,
    "coveragePercentage": 78,
    "securityIssues": 2
  }
}
```

### Estados de Validación
- **PASSED** (≥80 puntos): Cumple estándares
- **WARNING** (60-79 puntos): Cumple parcialmente
- **FAILED** (<60 puntos): No cumple estándares

## 🔄 Flujo de Trabajo

1. **Colocar microservicio** en `input/microservices/mi-proyecto/`
2. **Ejecutar validación**: "Valida el microservicio mi-proyecto"
3. **Detectar tecnología** automáticamente
4. **Delegar al validador** especializado
5. **Recibir reporte** con puntuación y recomendaciones
6. **Aplicar mejoras** según recomendaciones

## 🧪 Ejemplo de Uso

```bash
# Estructura de entrada
input/microservices/
├── ecommerce-api/          # Node.js/NestJS
│   ├── package.json
│   ├── src/
│   └── test/
└── user-service/           # Java/Spring Boot
    ├── pom.xml
    ├── src/main/java/
    └── src/test/java/
```

**En Claude:**
```
Valida todos los microservicios en input/microservices/ y guarda los reportes en output/validation-reports/
```

**Resultado:**
- `validation-report-ecommerce-api-[timestamp].json`
- `validation-report-user-service-[timestamp].json`

## 🔌 Validadores Soportados

- ✅ **Node.js**: `demo-mcp-3-standards-validator_nodejs`
- ✅ **Java**: `demo-mcp-3-standards-validator_java`
- 🔄 **.NET**: `demo-mcp-3-standards-validator_dotnet` (futuro)

## 🐛 Solución de Problemas

### "No se pudo determinar la tecnología"
- Verifica que el proyecto tenga archivos característicos (`package.json`, `pom.xml`)
- Revisa que la estructura de carpetas sea estándar

### "Validador no disponible"
- Verifica que el MCP validador esté compilado (`npm run build`)
- Revisa las rutas en la configuración del orquestador

### Reportes vacíos
- Verifica permisos de escritura en `output/validation-reports/`
- Revisa logs en la consola de Claude Desktop

## 📄 Licencia
MIT License