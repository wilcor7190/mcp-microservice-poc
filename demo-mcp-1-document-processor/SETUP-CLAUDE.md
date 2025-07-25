# Configuración MCP Document Processor para Claude Desktop

## Método 1: Claude Desktop (Recomendado)

### 1. Ubicar el archivo de configuración de Claude Desktop

El archivo de configuración se encuentra en:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### 2. Compilar el proyecto

```bash
cd "c:\MCP\demo\demo-mcp-1-document-processor"
npm run build
```

### 3. Agregar configuración al archivo de Claude

Abre el archivo `claude_desktop_config.json` y añade esta configuración:

```json
{
  "mcpServers": {
    "demo-document-processor-1": {
      "command": "node",
      "args": [
        "c:\\MCP\\demo\\demo-mcp-1-document-processor\\dist\\index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Nota**: Si ya tienes otros MCPs configurados, simplemente añade la entrada `"demo-document-processor-1"` dentro del objeto `mcpServers`.

### 4. Reiniciar Claude Desktop

Cierra completamente Claude Desktop y vuélvelo a abrir.

### 5. Verificar conexión

En Claude, deberías ver una indicación de que el MCP está conectado. Puedes probar con comandos como:
- "Procesa este archivo Excel"
- "Analiza este documento de especificaciones"

## Método 2: VS Code con extensión MCP

### 1. Instalar extensión MCP para VS Code

```bash
code --install-extension modelcontextprotocol.mcp
```

### 2. Configurar en VS Code

1. Abrir VS Code
2. Ir a Settings (Ctrl+,)
3. Buscar "MCP"
4. Añadir la configuración del servidor

## Método 3: Línea de comandos (Para desarrollo)

### Ejecutar directamente

```bash
cd "c:\MCP\demo\demo-mcp-1-document-processor"
npm start
```

### Probar con cliente MCP

```bash
npx @modelcontextprotocol/inspector
```

## Herramientas disponibles una vez conectado

1. **process_microservice_specification** - Procesa documentos Excel/Word con especificaciones
2. **analyze_documents** - Analiza todos los documentos en un directorio
3. **generate_technical_guide** - Genera guías técnicas basadas en historias de usuario

## Archivos de entrada soportados

- `.xlsx`, `.xls` - Archivos Excel con especificaciones técnicas
- `.docx`, `.doc` - Documentos Word
- `.txt`, `.csv` - Archivos de texto plano

## Estructura de salida

Los archivos JSON generados incluyen:
- Metadata del documento
- Información del microservicio
- Arquitectura y patrones
- Endpoints con parámetros detallados
- Integraciones con servicios legados
- Configuración de seguridad
- Detalles técnicos específicos

## Solución de problemas

1. **MCP no aparece en Claude**: Verificar que el archivo de configuración esté en la ubicación correcta
2. **Error de permisos**: Asegurar que Node.js esté instalado y accesible
3. **Archivos no encontrados**: Verificar las rutas absolutas en la configuración
4. **Error de compilación**: Ejecutar `npm run build` antes de usar

## Logs y debugging

Para ver logs detallados, ejecutar:
```bash
cd "c:\MCP\demo\demo-mcp-1-document-processor"
npm run dev
```
