@echo off
echo ==========================================
echo  Configurando MCP Document Processor
echo  para Claude Desktop
echo ==========================================
echo.

REM Compilar el proyecto
echo [1/4] Compilando proyecto...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo al compilar el proyecto
    pause
    exit /b 1
)

REM Buscar archivo de configuración de Claude
echo [2/4] Buscando configuracion de Claude Desktop...
set CLAUDE_CONFIG="%APPDATA%\Claude\claude_desktop_config.json"

REM Verificar si el directorio existe
if not exist "%APPDATA%\Claude" (
    echo Creando directorio de configuracion de Claude...
    mkdir "%APPDATA%\Claude"
)

REM Crear o actualizar configuración
echo [3/4] Configurando MCP en Claude Desktop...

REM Verificar si el archivo ya existe
if exist %CLAUDE_CONFIG% (
    echo Archivo de configuracion existente encontrado.
    echo IMPORTANTE: Debes añadir manualmente la configuracion al archivo existente:
    echo %CLAUDE_CONFIG%
    echo.
    echo Añade esta seccion a tu configuracion existente:
    echo {
    echo   "mcpServers": {
    echo     "demo-document-processor-1": {
    echo       "command": "node",
    echo       "args": [
    echo         "%CD%\dist\index.js"
    echo       ],
    echo       "env": {
    echo         "NODE_ENV": "production"
    echo       }
    echo     }
    echo   }
    echo }
) else (
    echo Creando nuevo archivo de configuracion...
    (
        echo {
        echo   "mcpServers": {
        echo     "demo-document-processor-1": {
        echo       "command": "node",
        echo       "args": [
        echo         "%CD:\=\\%\\dist\\index.js"
        echo       ],
        echo       "env": {
        echo         "NODE_ENV": "production"
        echo       }
        echo     }
        echo   }
        echo }
    ) > %CLAUDE_CONFIG%
    echo Configuracion creada exitosamente.
)

echo [4/4] Verificando configuracion...
if exist %CLAUDE_CONFIG% (
    echo ✅ Archivo de configuracion encontrado: %CLAUDE_CONFIG%
) else (
    echo ❌ Error: No se pudo crear el archivo de configuracion
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  ✅ CONFIGURACION COMPLETADA
echo ==========================================
echo.
echo Pasos finales:
echo 1. Cierra Claude Desktop completamente
echo 2. Vuelve a abrir Claude Desktop
echo 3. El MCP Document Processor deberia estar disponible
echo.
echo Para probar, di en Claude:
echo "Procesa este archivo Excel de especificaciones"
echo.
echo Archivo de configuracion: %CLAUDE_CONFIG%
echo.
pause
