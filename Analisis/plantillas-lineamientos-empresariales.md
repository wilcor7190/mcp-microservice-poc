# 📋 Plantillas y Lineamientos Empresariales

## 🎯 Objetivo

Documentar las plantillas existentes (Node.js, Spring Boot) y los lineamientos empresariales que deben aplicarse automáticamente en la fábrica de desarrollo.

---

## 🟢 Plantilla Node.js + Clean Architecture

### Estructura Estándar
```
src/
├── domain/                 # Entidades y reglas de negocio
│   ├── entities/
│   │   ├── User.js
│   │   └── index.js
│   ├── repositories/       # Interfaces de repositorios
│   │   ├── UserRepository.js
│   │   └── index.js
│   └── use-cases/         # Casos de uso de negocio
│       ├── CreateUser.js
│       ├── GetUser.js
│       └── index.js
├── application/           # Capa de aplicación
│   ├── controllers/       # Controladores REST
│   │   ├── UserController.js
│   │   └── index.js
│   ├── middlewares/       # Middlewares transversales
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── index.js
│   └── services/          # Servicios de aplicación
│       ├── UserService.js
│       └── index.js
└── infrastructure/        # Implementaciones concretas
    ├── database/
    │   ├── repositories/
    │   │   ├── MongoUserRepository.js
    │   │   └── index.js
    │   ├── models/
    │   │   ├── UserModel.js
    │   │   └── index.js
    │   └── connection.js
    ├── external-services/  # APIs externas
    │   ├── EmailService.js
    │   └── index.js
    └── web/               # Configuración Express
        ├── routes/
        │   ├── userRoutes.js
        │   └── index.js
        ├── server.js
        └── app.js
```

### Stack Tecnológico Estándar
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "language": "JavaScript/TypeScript",
  "database": {
    "primary": "MongoDB",
    "alternative": "PostgreSQL"
  },
  "orm": "Mongoose / Prisma",
  "validation": "Joi / Zod",
  "testing": {
    "unit": "Jest",
    "integration": "Supertest",
    "coverage": "90%+"
  },
  "documentation": "Swagger/OpenAPI",
  "logging": "Winston",
  "monitoring": "Prometheus metrics"
}
```

### Casos de Uso Ideales
- ✅ **APIs REST simples** (CRUD, consultas)
- ✅ **Microservicios ligeros** (< 1000 líneas de código)
- ✅ **Prototipado rápido**
- ✅ **Servicios de agregación de datos**
- ✅ **APIs Gateway**
- ⚠️ **Procesamiento intensivo** (considerar otras opciones)

---

## 🔵 Plantilla Spring Boot + Clean Architecture

### Estructura Estándar
```
src/
├── main/
│   ├── java/com/empresa/microservicio/
│   │   ├── domain/              # Entidades y reglas de negocio
│   │   │   ├── entities/
│   │   │   │   ├── User.java
│   │   │   │   └── BaseEntity.java
│   │   │   ├── repositories/    # Interfaces de repositorios
│   │   │   │   └── UserRepository.java
│   │   │   ├── services/        # Interfaces de servicios
│   │   │   │   └── UserService.java
│   │   │   └── exceptions/      # Excepciones de dominio
│   │   │       └── UserNotFoundException.java
│   │   ├── application/         # Casos de uso
│   │   │   ├── usecases/
│   │   │   │   ├── CreateUserUseCase.java
│   │   │   │   └── GetUserUseCase.java
│   │   │   └── dto/            # DTOs de aplicación
│   │   │       ├── UserRequestDTO.java
│   │   │       └── UserResponseDTO.java
│   │   └── infrastructure/      # Implementaciones
│   │       ├── web/            # Controladores REST
│   │       │   ├── controllers/
│   │       │   │   └── UserController.java
│   │       │   ├── config/
│   │       │   │   └── WebConfig.java
│   │       │   └── advice/     # Exception handlers
│   │       │       └── GlobalExceptionHandler.java
│   │       ├── persistence/    # JPA/Database
│   │       │   ├── entities/
│   │       │   │   └── UserEntity.java
│   │       │   ├── repositories/
│   │       │   │   └── JpaUserRepository.java
│   │       │   └── config/
│   │       │       └── DatabaseConfig.java
│   │       └── external/       # Servicios externos
│   │           ├── clients/
│   │           │   └── EmailClient.java
│   │           └── config/
│   │               └── ExternalConfig.java
│   └── resources/
│       ├── application.yml
│       ├── application-dev.yml
│       └── application-prod.yml
└── test/
    ├── java/com/empresa/microservicio/
    │   ├── unit/
    │   ├── integration/
    │   └── e2e/
    └── resources/
        └── application-test.yml
```

### Stack Tecnológico Estándar
```json
{
  "framework": "Spring Boot 3.x",
  "language": "Java 17+",
  "database": {
    "primary": "PostgreSQL",
    "alternative": "Oracle"
  },
  "orm": "Spring Data JPA",
  "validation": "Bean Validation (Hibernate Validator)",
  "security": "Spring Security",
  "testing": {
    "unit": "JUnit 5 + Mockito",
    "integration": "TestContainers",
    "coverage": "JaCoCo 90%+"
  },
  "documentation": "SpringDoc OpenAPI",
  "logging": "Logback + SLF4J",
  "monitoring": "Micrometer + Actuator"
}
```

### Casos de Uso Ideales
- ✅ **Aplicaciones empresariales** (transacciones, seguridad)
- ✅ **Microservicios complejos** (> 1000 líneas)
- ✅ **Integración con sistemas legacy**
- ✅ **Procesamiento de datos en lotes**
- ✅ **Servicios con alta concurrencia**
- ✅ **Cumplimiento normativo** (auditoría, trazabilidad)

---

## 📏 Lineamientos Empresariales

### 1. Estándares de Código

#### Nomenclatura
```yaml
# Nombres de proyectos
Pattern: "microservicio-{dominio}-{función}"
Examples:
  - "microservicio-usuarios-auth"
  - "microservicio-pagos-procesamiento"
  - "microservicio-inventario-consultas"

# Paquetes Java
Pattern: "com.empresa.{dominio}.{microservicio}"
Example: "com.empresa.usuarios.auth"

# Módulos Node.js
Pattern: "@empresa/{dominio}-{microservicio}"
Example: "@empresa/usuarios-auth"
```

#### Estructura de APIs
```yaml
# Endpoints REST
Pattern: "/api/v{version}/{resource}"
Examples:
  - "GET /api/v1/users"
  - "POST /api/v1/users"
  - "GET /api/v1/users/{id}"

# Versionado
- Siempre incluir versión en URL
- Mantener retrocompatibilidad por 2 versiones
- Deprecar con headers de warning
```

### 2. Configuración Estándar

#### Variables de Entorno
```yaml
# Base (todos los microservicios)
PORT: 3000 (Node.js) / 8080 (Spring Boot)
NODE_ENV: development/staging/production
SPRING_PROFILES_ACTIVE: dev/staging/prod

# Base de datos
DB_HOST: localhost
DB_PORT: 5432/27017
DB_NAME: microservicio_nombre
DB_USER: {vault_reference}
DB_PASSWORD: {vault_reference}

# Monitoreo
HEALTH_CHECK_PATH: /health
METRICS_PATH: /metrics
LOG_LEVEL: info
```

#### Configuración de Logging
```yaml
# Formato estándar JSON
{
  "timestamp": "2025-07-09T10:00:00.000Z",
  "level": "info",
  "service": "microservicio-usuarios-auth",
  "correlationId": "uuid-v4",
  "message": "User created successfully",
  "data": {
    "userId": "12345",
    "action": "create_user"
  }
}
```

### 3. Seguridad Obligatoria

#### Autenticación
```yaml
# JWT Estándar
- Header: Authorization: Bearer {token}
- Algoritmo: RS256
- Expiración: 1 hora (access token)
- Refresh: 24 horas (refresh token)

# Validación obligatoria
- Validar signature
- Verificar expiración
- Validar permisos por endpoint
```

#### Headers de Seguridad
```yaml
# Headers obligatorios en responses
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### 4. Testing Obligatorio

#### Cobertura Mínima
```yaml
# Node.js
unit_tests: 90%
integration_tests: 80%
e2e_tests: 70%

# Spring Boot
unit_tests: 90%
integration_tests: 85%
contract_tests: 75%
```

#### Estructura de Tests
```javascript
// Node.js - Jest
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user successfully', () => {
      // Given, When, Then
    });
    
    it('should throw error when email exists', () => {
      // Given, When, Then
    });
  });
});
```

```java
// Spring Boot - JUnit 5
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Test
    @DisplayName("Should create user successfully")
    void shouldCreateUserSuccessfully() {
        // Given, When, Then
    }
    
    @Test
    @DisplayName("Should throw error when email exists")
    void shouldThrowErrorWhenEmailExists() {
        // Given, When, Then
    }
}
```

### 5. Documentación Obligatoria

#### README.md Estándar
```markdown
# Microservicio [Nombre]

## Descripción
[Descripción del propósito del microservicio]

## Stack Tecnológico
- [Lista del stack usado]

## Configuración
### Variables de Entorno
[Lista de variables requeridas]

### Base de Datos
[Instrucciones de setup de BD]

## Endpoints
### GET /api/v1/health
Health check del servicio

[Lista completa de endpoints]

## Desarrollo Local
```bash
npm install && npm run dev
# o
./mvnw spring-boot:run
```

## Testing
[Instrucciones para ejecutar tests]

## Deployment
[Instrucciones de despliegue]
```

#### OpenAPI/Swagger
```yaml
# Obligatorio en todos los microservicios
openapi: 3.0.0
info:
  title: Microservicio [Nombre]
  version: 1.0.0
  description: [Descripción]
  contact:
    name: Equipo [Nombre]
    email: [email@empresa.com]
```

### 6. CI/CD Pipeline Estándar

#### azure-pipelines.yml (Node.js)
```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Test
    jobs:
      - job: UnitTests
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
          - script: npm install
          - script: npm run test:coverage
          - script: npm run lint
          
  - stage: Build
    dependsOn: Test
    jobs:
      - job: Docker
        steps:
          - task: Docker@2
            inputs:
              command: 'buildAndPush'
              
  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: Production
        environment: 'production'
```

#### azure-pipelines.yml (Spring Boot)
```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Test
    jobs:
      - job: UnitTests
        steps:
          - task: JavaToolInstaller@0
            inputs:
              versionSpec: '17'
              jdkArchitectureOption: 'x64'
              jdkSourceOption: 'PreInstalled'
          - script: ./mvnw clean test
          - script: ./mvnw jacoco:report
          
  - stage: Build
    dependsOn: Test
    jobs:
      - job: Maven
        steps:
          - script: ./mvnw clean package
          - task: Docker@2
```

---

## 🎯 Aplicación Automática de Lineamientos

### En el Generador MCP
```typescript
interface GuidelinesApplier {
  // Aplicar nomenclatura estándar
  applyNamingConventions(project: Project): Project;
  
  // Configurar estructura de logging
  setupStandardLogging(project: Project): Project;
  
  // Aplicar configuración de seguridad
  applySecurityStandards(project: Project): Project;
  
  // Generar tests con estructura estándar
  generateStandardTests(project: Project): Project;
  
  // Crear documentación base
  generateStandardDocs(project: Project): Project;
  
  // Configurar pipeline CI/CD
  setupStandardPipeline(project: Project): Project;
}
```

### Validación Automática
```typescript
interface GuidelinesValidator {
  // Validar adherencia a estándares
  validateCompliance(project: Project): ComplianceReport;
  
  // Verificar estructura de archivos
  validateFileStructure(project: Project): StructureValidation;
  
  // Validar configuración de seguridad
  validateSecurity(project: Project): SecurityValidation;
  
  // Verificar cobertura de tests
  validateTestCoverage(project: Project): CoverageValidation;
}
```

---

## 📊 Matriz de Decisión Automatizada

| Criterio | Peso | Node.js Score | Spring Boot Score | Decisión |
|----------|------|---------------|-------------------|----------|
| **Complejidad de Negocio** | 30% | 3/5 | 5/5 | Si > 4: Spring Boot |
| **Performance Requerida** | 25% | 5/5 | 4/5 | Si I/O intensivo: Node.js |
| **Integraciones Empresariales** | 20% | 3/5 | 5/5 | Si > 3 sistemas: Spring Boot |
| **Time to Market** | 15% | 5/5 | 3/5 | Si urgente: Node.js |
| **Tamaño del Equipo** | 10% | 4/5 | 4/5 | Neutral |

**Fórmula de Decisión**:
```
Score = Σ(Criterio × Peso)
Si Score_NodeJS > Score_SpringBoot + 0.5 → Node.js
Si Score_SpringBoot > Score_NodeJS + 0.5 → Spring Boot
Sino → Consultar con arquitecto
```

---

**Estado**: ✅ **Lineamientos documentados**  
**Próximo paso**: Implementar aplicación automática en MCP Generator
