@echo off
echo 🚀 MCP Document Processor - Inicio
echo ================================

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo 💡 Instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si el proyecto está compilado
if not exist "dist\index.js" (
    echo 📦 Compilando proyecto...
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ Error al compilar el proyecto
        pause
        exit /b 1
    )
)

REM Verificar carpetas
if not exist "input-specifications" (
    echo 📁 Creando carpeta input-specifications...
    mkdir input-specifications
)

if not exist "output-json" (
    echo 📁 Creando carpeta output-json...
    mkdir output-json
)

REM Mostrar archivos disponibles
echo.
echo 📄 Archivos disponibles para procesar:
echo ====================================
dir /b input-specifications\*.xlsx input-specifications\*.xls 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  No hay archivos Excel en input-specifications\
    echo 💡 Coloca tus archivos .xlsx en la carpeta input-specifications\
)

echo.
echo 🔄 Iniciando MCP Document Processor...
echo ====================================
node dist\index.js

echo.
echo ✅ MCP Document Processor finalizado
pause
