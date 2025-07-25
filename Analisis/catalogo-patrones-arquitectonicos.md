# Catálogo de Patrones Arquitectónicos para Microservicios

## 🏛️ Patrones Fundamentales

### 1. API Gateway Pattern
**Descripción**: Punto único de entrada para todas las peticiones de clientes
**Cuándo usar**: Múltiples microservicios, necesidad de centralizar concerns transversales
**Tecnologías**: Kong, AWS API Gateway, Azure API Management, Express Gateway

```yaml
Características:
  - Routing de requests
  - Autenticación y autorización
  - Rate limiting
  - Monitoring y logging
  - Transformación de datos
```

**Ejemplo de implementación**:
```javascript
// API Gateway con Express
app.use('/users', proxy('http://user-service:3001'));
app.use('/orders', proxy('http://order-service:3002'));
app.use('/inventory', proxy('http://inventory-service:3003'));
```

### 2. Circuit Breaker Pattern
**Descripción**: Previene cascadas de fallos en sistemas distribuidos
**Cuándo usar**: Integraciones con servicios externos, alta dependencia entre servicios
**Tecnologías**: Hystrix, Resilience4j, opossum (Node.js)

```yaml
Estados:
  - CLOSED: Peticiones normales
  - OPEN: Bloquea peticiones, retorna error inmediato
  - HALF_OPEN: Permite peticiones limitadas para testing
```

### 3. Event Sourcing Pattern
**Descripción**: Almacena eventos en lugar del estado actual
**Cuándo usar**: Auditoría completa, sistemas complejos con múltiples agregados
**Tecnologías**: EventStore, Apache Kafka, MongoDB

```yaml
Beneficios:
  - Auditoría completa
  - Reconstrucción del estado
  - Debugging temporal
  - Escalabilidad de lectura
```

### 4. CQRS (Command Query Responsibility Segregation)
**Descripción**: Separa operaciones de lectura y escritura
**Cuándo usar**: Diferentes requisitos de rendimiento para lectura/escritura
**Tecnologías**: Axon Framework, MediatR, custom implementations

```yaml
Componentes:
  - Command Side: Manejo de escrituras
  - Query Side: Optimizado para lecturas
  - Event Bus: Sincronización entre lados
```

## 🔄 Patrones de Comunicación

### 5. Publish-Subscribe Pattern
**Descripción**: Comunicación asíncrona mediante eventos
**Cuándo usar**: Desacoplamiento temporal, notificaciones, integración de sistemas
**Tecnologías**: RabbitMQ, Apache Kafka, Redis Pub/Sub, AWS SNS/SQS

```yaml
Características:
  - Desacoplamiento temporal
  - Escalabilidad horizontal
  - Tolerancia a fallos
  - Eventual consistency
```

### 6. Request-Reply Pattern
**Descripción**: Comunicación síncrona con respuesta
**Cuándo usar**: Operaciones que requieren respuesta inmediata
**Tecnologías**: HTTP REST, gRPC, GraphQL

```yaml
Ventajas:
  - Simplicidad de implementación
  - Consistency fuerte
  - Debugging más fácil
```

### 7. Saga Pattern
**Descripción**: Manejo de transacciones distribuidas
**Cuándo usar**: Operaciones que involucran múltiples servicios
**Tecnologías**: Axon Saga, AWS Step Functions, custom orchestrators

```yaml
Tipos:
  - Choreography: Cada servicio maneja su parte
  - Orchestration: Coordinador central
```

## 📊 Patrones de Datos

### 8. Database per Service
**Descripción**: Cada microservicio tiene su propia base de datos
**Cuándo usar**: Aislamiento de datos, tecnologías específicas por servicio
**Tecnologías**: PostgreSQL, MongoDB, Redis, Cassandra

```yaml
Beneficios:
  - Aislamiento de datos
  - Tecnología apropiada por servicio
  - Escalabilidad independiente
```

### 9. Shared Database (Anti-pattern)
**Descripción**: Múltiples servicios acceden a la misma base de datos
**Cuándo evitar**: En arquitecturas de microservicios maduras
**Cuándo puede ser aceptable**: Fases de transición, legacy systems

```yaml
Problemas:
  - Acoplamiento fuerte
  - Conflictos de esquema
  - Dificultad de escalamiento
```

### 10. Event Sourcing + CQRS
**Descripción**: Combinación de ambos patrones
**Cuándo usar**: Sistemas complejos con alta concurrencia
**Tecnologías**: EventStore + Read Models (ElasticSearch, MongoDB)

## 🛡️ Patrones de Seguridad

### 11. API Key Pattern
**Descripción**: Autenticación mediante claves únicas
**Cuándo usar**: APIs públicas, partners externos
**Implementación**: Headers, Query parameters, Bearer tokens

### 12. JWT Token Pattern
**Descripción**: Tokens auto-contenidos para autenticación
**Cuándo usar**: SPAs, mobile apps, microservicios
**Tecnologías**: jsonwebtoken, jose, Auth0

### 13. OAuth2 / OpenID Connect
**Descripción**: Delegación de autorización estándar
**Cuándo usar**: Aplicaciones que necesitan acceso a recursos de terceros
**Tecnologías**: Keycloak, Auth0, Azure AD

## 📈 Patrones de Observabilidad

### 14. Distributed Tracing
**Descripción**: Seguimiento de peticiones a través de múltiples servicios
**Cuándo usar**: Debugging en sistemas distribuidos
**Tecnologías**: Jaeger, Zipkin, AWS X-Ray

### 15. Centralized Logging
**Descripción**: Agregación de logs de todos los servicios
**Cuándo usar**: Debugging, auditoría, monitoreo
**Tecnologías**: ELK Stack, Fluentd, Splunk

### 16. Health Check Pattern
**Descripción**: Endpoints para verificar el estado de servicios
**Cuándo usar**: Monitoreo automatizado, load balancing
**Implementación**: REST endpoints, actuator endpoints

## 🔧 Matriz de Selección de Patrones

| Escenario | Patrones Recomendados | Complejidad | Beneficios |
|-----------|----------------------|-------------|------------|
| **CRUD Simple** | API Gateway + Database per Service | Baja | Simplicidad, aislamiento |
| **Alta Concurrencia** | CQRS + Event Sourcing | Alta | Performance, auditabilidad |
| **Integraciones Complejas** | Saga + Circuit Breaker | Media | Consistencia, resilencia |
| **Tiempo Real** | Pub/Sub + WebSockets | Media | Baja latencia, escalabilidad |
| **Procesamiento por Lotes** | Event Sourcing + Queue | Media | Throughput, tolerancia a fallos |

## 📝 Plantilla de Decisión de Patrón

```yaml
Proyecto: [Nombre del proyecto]
Contexto: [Descripción del problema a resolver]
Opciones Consideradas:
  - Patrón A: [Pros y contras]
  - Patrón B: [Pros y contras]
  - Patrón C: [Pros y contras]
Decisión: [Patrón seleccionado]
Justificación: [Razones de la decisión]
Consecuencias: [Implicaciones de la decisión]
```

---

**Última actualización**: 9 de Julio, 2025
**Versión**: 1.0
**Mantenedor**: Equipo MCP DevAccelerator
