# Carpeta de Especificaciones de Entrada

Esta carpeta es donde debes colocar los archivos Excel (.xlsx) que contienen las especificaciones técnicas de los microservicios.

## Formato Esperado del Excel

El MCP puede procesar archivos Excel con las siguientes estructuras:

### Hoja 1: Información General
- **Nombre del Servicio**: Columna A
- **Descripción**: Columna B  
- **Versión**: Columna C
- **Puerto**: Columna D

### Hoja 2: Endpoints (Opcional)
- **Método HTTP**: Columna A
- **Ruta**: Columna B
- **Descripción**: Columna C
- **Parámetros**: Columna D

### Hoja 3: Integraciones (Opcional)  
- **Sistema**: Columna A
- **Tipo**: Columna B
- **Endpoint**: Columna C
- **Descripción**: Columna D

## Ejemplo de uso

1. Coloca tu archivo Excel aquí (ej: `especificacion-user-service.xlsx`)
2. Ejecuta el MCP con la herramienta `process_microservice_specification`
3. El JSON resultante se generará en la carpeta `output-json`

## Archivos de ejemplo

Se pueden incluir archivos de ejemplo para probar el MCP.
