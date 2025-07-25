import Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  MicroserviceSpecification, 
  SpringBootProject,
  Integration,
  InputParameter
} from '../types/index.js';

export class TemplateEngine {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  
  constructor() {
    this.registerHelpers();
  }
  
  private registerHelpers(): void {
    // Helper para convertir a PascalCase
    Handlebars.registerHelper('pascalCase', (str: string) => {
      return str.split(/[-_]/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
    });
    
    // Helper para convertir a camelCase
    Handlebars.registerHelper('camelCase', (str: string) => {
      const pascal = str.split(/[-_]/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('');
      return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });
    
    // Helper para package path
    Handlebars.registerHelper('packagePath', (packageName: string) => {
      return packageName.replace(/\./g, '/');
    });
    
    // Helper para tipo Java
    Handlebars.registerHelper('javaType', (type: string) => {
      switch (type.toLowerCase()) {
        case 'string': return 'String';
        case 'number': return 'Long';
        case 'integer': return 'Integer';
        case 'boolean': return 'Boolean';
        case 'date': return 'LocalDateTime';
        default: return 'String';
      }
    });
    
    // Helper para anotaciones JPA
    Handlebars.registerHelper('jpaAnnotation', (database: string) => {
      switch (database.toLowerCase()) {
        case 'oracle': return '@Column(name = "{{field_name}}")';
        case 'postgresql': return '@Column(name = "{{field_name}}")';
        case 'mysql': return '@Column(name = "{{field_name}}")';
        default: return '@Column';
      }
    });
  }
  
  async renderPomXml(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.7</version>
        <relativePath/>
    </parent>
    
    <groupId>{{basePackage}}</groupId>
    <artifactId>{{name}}</artifactId>
    <version>{{version}}</version>
    <name>{{name}}</name>
    <description>{{description}}</description>
    
    <properties>
        <java.version>17</java.version>
        <maven.compiler.target>17</maven.compiler.target>
        <maven.compiler.source>17</maven.compiler.source>
    </properties>
    
    <dependencies>
        {{#each dependencies}}
        {{#if (eq this "spring-boot-starter-web")}}
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        {{/if}}
        {{#if (eq this "spring-boot-starter-data-jpa")}}
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        {{/if}}
        {{#if (eq this "spring-boot-starter-actuator")}}
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        {{/if}}
        {{#if (eq this "spring-boot-starter-validation")}}
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        {{/if}}
        {{#if (eq this "ojdbc8")}}
        <dependency>
            <groupId>com.oracle.database.jdbc</groupId>
            <artifactId>ojdbc8</artifactId>
            <version>21.3.0.0</version>
        </dependency>
        {{/if}}
        {{#if (eq this "postgresql")}}
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
        {{/if}}
        {{#if (eq this "mysql-connector-java")}}
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        {{/if}}
        {{#if (eq this "lombok")}}
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        {{/if}}
        {{#if (eq this "springdoc-openapi-starter-webmvc-ui")}}
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.5.0</version>
        </dependency>
        {{/if}}
        {{/each}}
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      name: project.name,
      version: spec.microservice.version,
      description: spec.microservice.description,
      dependencies: project.dependencies
    });
  }
  
  async renderMainClass(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const className = project.name.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join('') + 'Application';
    
    const template = `package {{basePackage}};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal para {{name}}
 * {{description}}
 */
@SpringBootApplication
public class {{className}} {
    
    public static void main(String[] args) {
        SpringApplication.run({{className}}.class, args);
    }
}`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      name: project.name,
      description: spec.microservice.description,
      className
    });
  }
  
  async renderController(
    controllerName: string,
    endpoints: any[],
    project: SpringBootProject,
    spec: MicroserviceSpecification
  ): Promise<string> {
    const template = `package {{basePackage}}.infrastructure.web.controllers;

import {{basePackage}}.domain.services.*;
import {{basePackage}}.infrastructure.web.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST para {{controllerName}}
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@Validated
@Tag(name = "{{controllerName}}", description = "{{description}}")
public class {{controllerName}} {
    
    private final {{serviceName}}Service {{serviceField}}Service;
    
    {{#each endpoints}}
    @{{method}}("{{path}}")
    @Operation(summary = "{{description}}")
    public ResponseEntity<?> {{methodName}}(
        {{#each parameters}}
        @RequestParam(value = "{{this}}", required = false) String {{this}}{{#unless @last}},{{/unless}}
        {{/each}}
    ) {
        log.info("Ejecutando {{methodName}} con parámetros: {{parameters}}");
        
        try {
            // TODO: Implementar lógica de negocio
            var result = {{../serviceField}}Service.{{methodName}}({{#each parameters}}{{this}}{{#unless @last}}, {{/unless}}{{/each}});
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error en {{methodName}}: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    {{/each}}
}`;
    
    const serviceName = project.name.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join('').replace('Service', '');
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      controllerName,
      description: spec.microservice.description,
      serviceName,
      serviceField: serviceName.charAt(0).toLowerCase() + serviceName.slice(1),
      endpoints
    });
  }
  
  async renderService(
    serviceName: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification
  ): Promise<string> {
    const template = `package {{basePackage}}.domain.services;

import {{basePackage}}.domain.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de dominio para {{serviceName}}
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class {{serviceName}} {
    
    {{#each repositories}}
    private final {{this}} {{camelCase this}};
    {{/each}}
    
    {{#each methods}}
    public Object {{methodName}}({{#each parameters}}String {{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
        log.info("Ejecutando {{methodName}} con parámetros: {{parameters}}");
        
        try {
            // TODO: Implementar lógica de negocio
            return "Resultado de {{methodName}}";
        } catch (Exception e) {
            log.error("Error en {{methodName}}: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    {{/each}}
}`;
    
    const repositories = spec.integrations
      .filter(i => i.type.toLowerCase().includes('base de datos'))
      .map(i => i.name.replace(/^prc_/, '').replace(/_app$/, '') + 'Repository');
    
    const methods = spec.endpoints.map(e => ({
      methodName: e.method.toLowerCase() + e.path.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, ''),
      parameters: e.parameters || []
    }));
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      serviceName,
      repositories,
      methods
    });
  }
  
  async renderRepository(
    repositoryName: string,
    entityName: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification
  ): Promise<string> {
    const template = `package {{basePackage}}.domain.repositories;

import {{basePackage}}.domain.entities.{{entityName}};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para {{entityName}}
 */
@Repository
public interface {{repositoryName}} extends JpaRepository<{{entityName}}, Long> {
    
    // Métodos de consulta personalizados
    @Query("SELECT e FROM {{entityName}} e WHERE e.active = true")
    List<{{entityName}}> findAllActive();
    
    // TODO: Agregar métodos específicos según los endpoints
}`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      repositoryName,
      entityName
    });
  }
  
  async renderEntity(
    entityName: string,
    project: SpringBootProject,
    spec: MicroserviceSpecification,
    integration: Integration
  ): Promise<string> {
    const template = `package {{basePackage}}.domain.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * Entidad {{entityName}}
 * {{description}}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "{{tableName}}")
public class {{entityName}} {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    {{#each fields}}
    @Column(name = "{{columnName}}")
    private {{javaType type}} {{name}};
    
    {{/each}}
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "active")
    private Boolean active = true;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}`;
    
    // Extraer campos de los mapeos de la integración
    const fields = integration.legacyServices?.[0]?.outputMapping?.map(mapping => ({
      name: mapping.microserviceField.toLowerCase(),
      columnName: mapping.legacyField.toLowerCase(),
      type: mapping.type || 'String'
    })) || [];
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      entityName,
      tableName: entityName.toLowerCase(),
      description: integration.description,
      fields
    });
  }
  
  async renderRequestDTO(
    dtoName: string,
    inputParameters: InputParameter[],
    project: SpringBootProject
  ): Promise<string> {
    const template = `package {{basePackage}}.infrastructure.web.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO de request para {{dtoName}}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request para {{dtoName}}")
public class {{dtoName}} {
    
    {{#each fields}}
    @Schema(description = "{{description}}", required = {{required}})
    {{#if required}}@NotNull{{/if}}
    private {{javaType type}} {{name}};
    
    {{/each}}
}`;
    
    const fields = inputParameters.map(param => ({
      name: param.name,
      type: param.type,
      description: param.description,
      required: param.required
    }));
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      dtoName,
      fields
    });
  }
  
  async renderDatabaseConfig(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const template = `package {{basePackage}}.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Configuración de base de datos para {{name}}
 */
@Configuration
@EnableJpaRepositories(basePackages = "{{basePackage}}.domain.repositories")
@EnableTransactionManagement
public class DatabaseConfig {
    
    // Configuraciones adicionales de base de datos si son necesarias
}`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      name: project.name
    });
  }
  
  async renderSecurityConfig(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const template = `package {{basePackage}}.application.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de seguridad para {{name}}
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      name: project.name
    });
  }
  
  async renderApplicationProperties(
    project: SpringBootProject, 
    spec: MicroserviceSpecification, 
    profile: string
  ): Promise<string> {
    const template = `server:
  port: {{port}}

spring:
  application:
    name: {{name}}
  profiles:
    active: {{profile}}
  
  {{#if (eq database "oracle")}}
  datasource:
    url: jdbc:oracle:thin:@//localhost:1521/XE
    username: \${DB_USERNAME:user}
    password: \${DB_PASSWORD:password}
    driver-class-name: oracle.jdbc.OracleDriver
  
  jpa:
    database-platform: org.hibernate.dialect.OracleDialect
    hibernate:
      ddl-auto: validate
    show-sql: false
  {{/if}}
  
  {{#if (eq database "postgresql")}}
  datasource:
    url: jdbc:postgresql://localhost:5432/{{name}}
    username: \${DB_USERNAME:postgres}
    password: \${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate
    show-sql: false
  {{/if}}

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

logging:
  level:
    {{basePackage}}: INFO
    org.springframework.web: INFO
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      name: project.name,
      port: project.port,
      profile,
      database: project.database,
      basePackage: project.basePackage
    });
  }
  
  async renderReadme(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const template = `# {{name}}

{{description}}

## Descripción

{{summary}}

## Tecnologías

- **Framework**: Spring Boot 3.3.7
- **Java**: 17
- **Base de datos**: {{database}}
- **Build tool**: Maven

## Estructura del Proyecto

\`\`\`
src/
├── main/
│   ├── java/
│   │   └── {{packagePath basePackage}}/
│   │       ├── application/          # Configuración de aplicación
│   │       ├── domain/              # Lógica de dominio
│   │       ├── infrastructure/      # Infraestructura
│   │       └── shared/             # Componentes compartidos
│   └── resources/
│       ├── application.yml
│       └── application-{profile}.yml
└── test/
    └── java/                       # Tests unitarios e integración
\`\`\`

## Endpoints

{{#each endpoints}}
- **{{method}}** \`{{path}}\` - {{description}}
{{/each}}

## Configuración

### Variables de Entorno

- \`DB_USERNAME\`: Usuario de base de datos
- \`DB_PASSWORD\`: Contraseña de base de datos
- \`SPRING_PROFILES_ACTIVE\`: Perfil activo (dev, test, prod)

## Ejecutar la Aplicación

\`\`\`bash
# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Ejecutar aplicación
mvn spring-boot:run

# Crear JAR
mvn clean package
\`\`\`

## Docker

\`\`\`bash
# Construir imagen
docker build -t {{name}} .

# Ejecutar contenedor
docker run -p {{port}}:{{port}} {{name}}
\`\`\`

## Documentación API

Una vez ejecutada la aplicación, la documentación Swagger estará disponible en:
- http://localhost:{{port}}/swagger-ui.html

## Health Check

- http://localhost:{{port}}/actuator/health`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      name: project.name,
      description: spec.microservice.description,
      summary: spec.microservice.summary || spec.microservice.description,
      database: project.database,
      basePackage: project.basePackage,
      endpoints: spec.endpoints,
      port: project.port
    });
  }
  
  async renderDockerfile(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    return `FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/${project.name}-${spec.microservice.version}.jar app.jar

EXPOSE ${project.port}

ENTRYPOINT ["java", "-jar", "app.jar"]`;
  }
  
  async renderDockerCompose(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    return `version: '3.8'

services:
  ${project.name}:
    build: .
    ports:
      - "${project.port}:${project.port}"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - DB_USERNAME=user
      - DB_PASSWORD=password
    depends_on:
      - database

  database:
    image: ${project.database === 'oracle' ? 'gvenzl/oracle-xe:21-slim' : 
           project.database === 'postgresql' ? 'postgres:15' : 'mysql:8'}
    environment:
      ${project.database === 'postgresql' ? 
        '- POSTGRES_DB=' + project.name + '\n      - POSTGRES_USER=user\n      - POSTGRES_PASSWORD=password' :
        project.database === 'mysql' ?
        '- MYSQL_DATABASE=' + project.name + '\n      - MYSQL_USER=user\n      - MYSQL_PASSWORD=password\n      - MYSQL_ROOT_PASSWORD=root' :
        '- ORACLE_PASSWORD=password'}
    ports:
      - "${project.database === 'oracle' ? '1521:1521' : 
           project.database === 'postgresql' ? '5432:5432' : '3306:3306'}"`;
  }
  
  async renderKubernetesDeployment(
    project: SpringBootProject, 
    spec: MicroserviceSpecification, 
    profile: string
  ): Promise<string> {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${project.name}-${profile}
  labels:
    app: ${project.name}
    environment: ${profile}
spec:
  replicas: ${profile === 'prod' ? 3 : 1}
  selector:
    matchLabels:
      app: ${project.name}
      environment: ${profile}
  template:
    metadata:
      labels:
        app: ${project.name}
        environment: ${profile}
    spec:
      containers:
      - name: ${project.name}
        image: ${project.name}:latest
        ports:
        - containerPort: ${project.port}
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "${profile}"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: ${project.name}-secrets
              key: db-username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: ${project.name}-secrets
              key: db-password
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: ${project.name}-service-${profile}
spec:
  selector:
    app: ${project.name}
    environment: ${profile}
  ports:
  - port: 80
    targetPort: ${project.port}
  type: ClusterIP`;
  }
  
  async renderIntegrationTest(project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const template = `package {{basePackage}}.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Tests de integración para {{name}}
 */
@SpringBootTest
@ActiveProfiles("test")
public class ApplicationIntegrationTest {
    
    @Test
    void contextLoads() {
        // Test que verifica que el contexto de Spring se carga correctamente
    }
    
    @Test
    void healthEndpoint() {
        // TODO: Test del endpoint de health
    }
}`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      name: project.name
    });
  }
  
  async renderServiceTest(serviceName: string, project: SpringBootProject, spec: MicroserviceSpecification): Promise<string> {
    const template = `package {{basePackage}}.unit;

import {{basePackage}}.domain.services.{{serviceName}}Service;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

/**
 * Tests unitarios para {{serviceName}}Service
 */
@ExtendWith(MockitoExtension.class)
public class {{serviceName}}ServiceTest {
    
    @InjectMocks
    private {{serviceName}}Service {{serviceField}}Service;
    
    // TODO: Agregar mocks de repositorios necesarios
    
    @Test
    void shouldExecuteBusinessLogic() {
        // TODO: Implementar tests unitarios
    }
}`;
    
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({
      basePackage: project.basePackage,
      serviceName,
      serviceField: serviceName.charAt(0).toLowerCase() + serviceName.slice(1)
    });
  }
}