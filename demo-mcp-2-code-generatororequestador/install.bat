@echo off
REM MCP Microservice Orchestrator - Windows Installation Script
REM This script helps set up the MCP Orchestrator for use with Claude Desktop

echo 🚀 MCP Microservice Orchestrator - Installation Script
echo ========================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building TypeScript...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to build project
    pause
    exit /b 1
)

REM Get the current directory
set CURRENT_DIR=%CD%
set BUILD_PATH=%CURRENT_DIR%\build\index.js

echo.
echo ✅ Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Add this configuration to your Claude Desktop config file:
echo.
echo    {
echo      "mcpServers": {
echo        "microservice-orchestrator": {
echo          "command": "node",
echo          "args": ["%BUILD_PATH:\=\\%"]
echo        }
echo      }
echo    }
echo.
echo 2. Claude Desktop config file location:
echo    %%APPDATA%%\Claude\claude_desktop_config.json
echo.
echo 3. Restart Claude Desktop
echo.
echo 🎯 You're ready to use the MCP Microservice Orchestrator!
echo    Use it to analyze specifications and generate microservices automatically.
echo.
pause
