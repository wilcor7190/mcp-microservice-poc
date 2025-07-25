# MCP Node.js Code Generator for Microservices

Un Model Context Protocol (MCP) implementado en Node.js que genera código de microservicios basándose en especificaciones JSON y repositorios de referencia.

## 🚀 Características

- **Generación Automática**: Crea microservicios completos a partir de especificaciones técnicas
- **Arquitectura Limpia**: Implementa patrones de Clean Architecture con capas bien definidas
- **Múltiples Bases de Datos**: Soporte para Oracle, PostgreSQL, MySQL y MongoDB
- **Análisis de Patrones**: Extrae patrones de repositorios de referencia existentes
- **Compatible con MCP**: Funciona perfectamente con Claude Desktop y otros clientes MCP

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn
- Claude Desktop (para usar el MCP)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/wilcor7190/mcp-nodejs-microservice-generator.git
cd mcp-nodejs-microservice-generator
```

2. Instala las dependencias:
```bash
npm install
```

3. Compila el proyecto:
```bash
npm run build
```

## ⚙️ Configuración

### Configuración de Claude Desktop

Agrega la siguiente configuración a tu archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "demo21-nodejs": {
      "command": "node",
      "args": ["C:/MCP/demo/demo-mcp-21-code-generator-node/microservice-generator-mcp/dist/index.js"],
      "cwd": "C:/MCP/demo/demo-mcp-21-code-generator-node"
    }
  }
}
```

## 📁 Estructura del Proyecto

```
input/
├── specifications/           # Especificaciones JSON de microservicios
└── reference-repos/         # Repositorios de referencia para análisis de patrones
    └── ECOMMERCE_V9/
        ├── MSAbCaAlarFeaturesETL/
        ├── MSAbCaAlarPricesETL/
        └── ...

microservice-generator-mcp/  # Código fuente del MCP
├── src/
│   ├── analyzers/           # Analizadores de especificaciones y repositorios
│   ├── generators/          # Generadores de código
│   ├── templates/           # Plantillas de código
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Utilidades
└── dist/                   # Código compilado
```

## 🔧 Uso

### Desde Claude Desktop

Una vez configurado el MCP, puedes usar los siguientes comandos en Claude:

1. **Analizar carpeta input**:
```
Analiza la carpeta input y extrae patrones de los repositorios de referencia
```

2. **Generar microservicio**:
```
Genera un microservicio basado en la especificación y los patrones encontrados
```

3. **Validar salida**:
```
Valida el código generado en la carpeta output
```

### Desde Terminal

También puedes probar el MCP directamente:

```bash
# Probar generación
node test-generation.mjs

# Probar MCP directamente
node test-mcp-direct.mjs
```

## 📋 Funciones Disponibles

- `analyze-input`: Analiza especificaciones y repositorios de referencia
- `get-patterns`: Obtiene patrones identificados
- `generate-microservice`: Genera el microservicio completo
- `validate-output`: Valida el código generado
- `get-generation-status`: Obtiene el estado del proceso

## 🏗️ Arquitectura Generada

Los microservicios generados siguen esta estructura:

```
generated-microservice/
├── src/
│   ├── controller/         # Capa de presentación
│   ├── core/              # Lógica de negocio (use cases)
│   ├── data-provider/     # Capa de datos
│   └── common/            # Configuraciones y utilidades
├── test/                  # Pruebas
├── deploy/               # Configuraciones de despliegue
└── package.json          # Dependencias y scripts
```

## 🔗 Bases de Datos Soportadas

- **Oracle**: Con driver `oracledb`
- **PostgreSQL**: Con driver `pg`
- **MySQL**: Con driver `mysql2`
- **MongoDB**: Con driver `mongoose`

## 📝 Formato de Especificación

El MCP acepta especificaciones en formato JSON con la siguiente estructura:

```json
{
  "name": "nombre-del-microservicio",
  "description": "Descripción del microservicio",
  "database": "oracle",
  "endpoints": [...],
  "entities": [...],
  // ... otros campos
}
```

## 🧪 Testing

Ejecuta las pruebas:

```bash
npm test
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue si es necesario

## 🔄 Versiones

- **v1.0.0**: Versión inicial con soporte para NestJS y múltiples bases de datos
