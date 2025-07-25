@echo off
echo 🚀 Iniciando MCP Orchestrator...
echo.
cd /d "c:\MCP\demo\demo-mcp-2-code-generatororequestador"

REM Verificar si existe la carpeta build
if not exist "build" (
    echo ⚙️  Compilando TypeScript...
    call npx tsc
    if errorlevel 1 (
        echo ❌ Error en la compilación
        pause
        exit /b 1
    )
    echo ✅ Compilación exitosa
    echo.
)

echo 🎯 Ejecutando MCP Orchestrator...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   MCP Orchestrator para Generación de Microservicios
echo   Disponible en: Node.js y Spring Boot
echo   Configuración: claude_desktop_config.json
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

node build/index.js
