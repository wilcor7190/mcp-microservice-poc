@echo off
echo 🚀 DEMO MCP 1: Document Processor
echo ================================
cd /d "C:\MCP\MCP_DevAccelerator\demo-mcp-1-document-processor"
echo 📦 Instalando dependencias...
npm install
echo ⚡ Compilando proyecto...
npm run build
echo 🤖 Iniciando MCP 1...
npm start
