# Architecture Documentation

## Overview

This microservice follows Clean Architecture principles with the following layers:

## Project Structure

```
src/
├── domain/           # Business logic layer
│   ├── entities/     # Domain entities
│   ├── repositories/ # Repository interfaces
│   └── use-cases/    # Business use cases
├── infrastructure/   # External concerns
│   ├── database/     # Database implementations
│   ├── web/          # HTTP controllers
│   └── external/     # External service adapters
├── application/      # Application layer
│   ├── config/       # Configuration
│   ├── middlewares/  # Application middlewares
│   └── validators/   # Input validation
└── shared/           # Shared utilities
    ├── errors/       # Error handling
    └── utils/        # Common utilities
```

## Principles

1. **Dependency Inversion**: Dependencies point inward toward the domain
2. **Single Responsibility**: Each class has one reason to change
3. **Interface Segregation**: Clients depend only on interfaces they use
4. **Domain-Driven Design**: Business logic is isolated in the domain layer

## Database

- **Type**: ORACLE
- **ORM**: TypeORM

## Testing Strategy

- **Unit Tests**: Domain logic and use cases
- **Integration Tests**: Database and external service integrations
- **E2E Tests**: Full request/response cycles

## Security


- **Authentication**: JWT
- **Authorization**: RBAC
- **CORS**: Enabled

