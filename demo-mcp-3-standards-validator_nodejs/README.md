# MCP Node.js Standards Validator

Validador MCP especializado para microservicios Node.js/NestJS que verifica el cumplimiento de estándares de desarrollo específicos para esta tecnología.

## 🎯 Estándares Validados

### 🔐 Seguridad (30% del score)
- **Dependencias Seguras**: Sin vulnerabilidades conocidas (npm audit)
- **Secrets**: No hardcoded, uso de variables de entorno
- **Helmet**: Headers de seguridad configurados
- **CORS**: Configuración correcta de origins
- **Validación de Input**: Pipes/middleware de validación
- **Rate Limiting**: Protección contra ataques de fuerza bruta

### 🧪 Testing (25% del score)
- **Cobertura Mínima**: 80% de cobertura de código
- **Tests Unitarios**: Para services y controllers
- **Tests de Integración**: Para endpoints principales
- **Configuración Jest**: Setup apropiado
- **Tests E2E**: Para flujos críticos (opcional)
- **Mocks**: Uso adecuado para dependencias externas

### 📝 Calidad de Código (20% del score)
- **ESLint**: Configurado y sin errores
- **Prettier**: Formateo consistente
- **TypeScript Strict**: Modo strict habilitado
- **Arquitectura NestJS**: Estructura modular correcta
- **Convenciones**: Naming conventions (camelCase, PascalCase)
- **Complejidad**: Baja complejidad ciclomática (<10)
- **Imports**: Organizados y sin código muerto

### 📚 Documentación (15% del score)
- **README**: Completo con instalación, uso, API
- **Swagger/OpenAPI**: Documentación automática de API
- **JSDoc**: Funciones públicas documentadas
- **Changelog**: Historial de cambios (opcional)
- **Deployment**: Documentación de Docker/K8s

### ⚡ Performance (10% del score)
- **Compresión**: Gzip habilitado en respuestas
- **Caché**: Estrategia implementada (Redis, memory-cache)
- **Database Queries**: Optimizadas (paginación, selects específicos)
- **Memory Leaks**: Sin patrones problemáticos
- **Async/Await**: Uso correcto vs callbacks

## 🛠️ Instalación

```bash
npm install
npm run build
```

## ⚙️ Configuración en Claude Desktop

```json
{
  "mcpServers": {
    "nodejs-validator": {
      "command": "node",
      "args": ["C:/MCP/demo/demo-mcp-3-standards-validator_nodejs/dist/index.js"],
      "cwd": "C:/MCP/demo/demo-mcp-3-standards-validator_nodejs"
    }
  }
}
```

## 🔧 Herramientas MCP

### 1. `validate-microservice`
Validación completa contra todos los estándares.

**Ejemplo:**
```
Valida el microservicio Node.js en /path/to/project contra todos los estándares
```

### 2. `analyze-project`
Análisis técnico del proyecto.

**Ejemplo:**
```
Analiza la estructura técnica del proyecto Node.js
```

### 3. `get-standards`
Lista todos los estándares disponibles.

### 4. `validate-category`
Valida solo una categoría específica.

**Ejemplo:**
```
Valida solo los estándares de seguridad del proyecto
```

## 📊 Reportes de Validación

### Estructura del Reporte
```json
{
  "project": {
    "name": "mi-microservicio-nodejs",
    "framework": "nestjs",
    "hasTypeScript": true
  },
  "overallScore": 85,
  "overallStatus": "PASSED",
  "categories": [
    {
      "name": "security",
      "score": 90,
      "status": "PASSED",
      "rules": [...]
    }
  ],
  "recommendations": [
    {
      "priority": "HIGH",
      "category": "testing",
      "title": "Aumentar cobertura de tests",
      "action": "Agregar tests para controllers faltantes"
    }
  ],
  "summary": {
    "totalRules": 32,
    "passedRules": 27,
    "failedRules": 5,
    "coveragePercentage": 78,
    "securityIssues": 1
  }
}
```

### Estados de Validación
- **PASSED** (≥80 puntos): Cumple estándares Node.js
- **WARNING** (60-79 puntos): Cumple parcialmente
- **FAILED** (<60 puntos): No cumple estándares

## 🚀 Uso Típico

1. **Colocar proyecto Node.js** en carpeta accesible
2. **Ejecutar validación**: "Valida el microservicio Node.js"
3. **Revisar reporte** con puntuación y recomendaciones
4. **Implementar mejoras** según prioridades
5. **Re-validar** hasta alcanzar score deseado

## 📋 Checklist de Estándares

### Antes de la Validación
- [ ] Proyecto tiene `package.json` válido
- [ ] Dependencias instaladas (`npm install`)
- [ ] Tests ejecutables (`npm test`)
- [ ] Build exitoso (`npm run build`)

### Estándares Críticos (Obligatorios)
- [ ] Sin vulnerabilidades de seguridad altas/críticas
- [ ] No hay secrets hardcodeados
- [ ] Cobertura de tests ≥ 80%
- [ ] ESLint sin errores
- [ ] TypeScript en modo strict
- [ ] README con documentación básica

### Estándares Recomendados
- [ ] Swagger/OpenAPI configurado
- [ ] Helmet para headers de seguridad
- [ ] Rate limiting implementado
- [ ] Tests de integración
- [ ] JSDoc en funciones públicas
- [ ] Compresión habilitada

## 🔍 Ejemplos de Validaciones

### Proyecto NestJS Típico
```typescript
// ✅ Buenas prácticas detectadas:
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
```

### Configuración de Seguridad
```typescript
// ✅ Configuración de seguridad validada:
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## 🐛 Solución de Problemas

### "No se pudo leer package.json"
- Verificar que el archivo existe y es válido JSON
- Asegurar permisos de lectura

### "ESLint no configurado"
- Instalar ESLint: `npm install --save-dev eslint`
- Configurar: `npx eslint --init`

### "Cobertura insuficiente"
- Configurar Jest con coverage: `jest --coverage`
- Agregar tests para archivos sin cobertura

## 📄 Licencia
MIT License