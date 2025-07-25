# Reference Repositories

Esta carpeta debe contener repositorios Java/Spring Boot de referencia que el MCP analizará para extraer patrones arquitectónicos.

## Estructura Esperada

```
reference-repos/
├── SpringBootTemplate/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/company/template/
│   │   │   │       ├── application/
│   │   │   │       ├── domain/
│   │   │   │       ├── infrastructure/
│   │   │   │       └── shared/
│   │   │   └── resources/
│   │   └── test/
│   └── README.md
└── OtherRepository/
    └── ...
```

## Patrones que se Extraen

- **Framework**: Spring Boot, Spring, Quarkus, etc.
- **Arquitectura**: Layered, Hexagonal, MVC
- **Base de datos**: Oracle, PostgreSQL, MySQL, MongoDB
- **Estructura de paquetes**: Organización por layers
- **Dependencias**: Librerías utilizadas
- **Testing**: JUnit 4/5, TestNG, Spock

## Cómo Agregar Repositorios

1. Copia tu repositorio Java de referencia a esta carpeta
2. Asegúrate de que tenga la estructura Maven estándar
3. El MCP analizará automáticamente:
   - `pom.xml` para dependencias
   - Estructura de paquetes Java
   - Anotaciones Spring
   - Patrones arquitectónicos

## Ejemplo de Repository de Referencia

Coloca aquí repositorios como:
- Templates de microservicios corporativos
- Proyectos de referencia de arquitectura
- Implementaciones estándar de tu organización

El analizador extraerá automáticamente los patrones y los aplicará al código generado.