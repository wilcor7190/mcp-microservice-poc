# Copilot Instructions - MCP Orchestrator

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is an MCP (Model Context Protocol) Server project for microservice orchestration. The Orchestrator acts as a central hub that coordinates microservice generation by allowing users to choose between Node.js and Spring Boot technologies.

## Key Instructions
- You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt
- This project implements a TypeScript-based MCP server that orchestrates between specialized MCP generators
- When working with file operations, always use absolute paths as specified in the Windows environment
- The orchestrator connects to external MCP servers located at specific paths:
  - Node.js MCP: `C:\MCP\demo\demo-mcp-21-code-generator-node`
  - Spring Boot MCP: `C:\MCP\demo\demo-mcp-22-code-generator-java`
- Use proper error handling for file operations and external MCP connections
- Implement interactive CLI features for technology selection
- Follow the clean architecture pattern with distinct layers for analysis, selection, and execution
- Ensure all file transfers and monitoring operations are robust and handle edge cases
- Use TypeScript strict mode and proper type definitions
- Log to stderr only (never stdout) to avoid corrupting JSON-RPC messages
