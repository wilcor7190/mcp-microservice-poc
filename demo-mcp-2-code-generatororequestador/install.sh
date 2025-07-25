#!/bin/bash

# MCP Microservice Orchestrator - Installation Script
# This script helps set up the MCP Orchestrator for use with Claude Desktop

echo "🚀 MCP Microservice Orchestrator - Installation Script"
echo "========================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build project"
    exit 1
fi

# Get the current directory
CURRENT_DIR=$(pwd)
BUILD_PATH="$CURRENT_DIR/build/index.js"

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add this configuration to your Claude Desktop config file:"
echo ""
echo '   {
     "mcpServers": {
       "microservice-orchestrator": {
         "command": "node",
         "args": ["'$BUILD_PATH'"]
       }
     }
   }'
echo ""
echo "2. Claude Desktop config file locations:"
echo "   • Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
echo "   • macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   • Linux: ~/.config/Claude/claude_desktop_config.json"
echo ""
echo "3. Restart Claude Desktop"
echo ""
echo "🎯 You're ready to use the MCP Microservice Orchestrator!"
echo "   Use it to analyze specifications and generate microservices automatically."
