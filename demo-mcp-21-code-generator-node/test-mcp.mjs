#!/usr/bin/env node

import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const MCP_PATH = 'c:/MCP/demo/demo-mcp-21-code-generator-node/microservice-generator-mcp/dist/index.js';
const INPUT_PATH = 'c:/MCP/demo/demo-mcp-21-code-generator-node/input';
const OUTPUT_PATH = 'c:/MCP/demo/demo-mcp-21-code-generator-node/output';

async function callMCPTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const mcpProcess = spawn('node', [MCP_PATH], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    mcpProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcpProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    mcpProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`MCP process exited with code ${code}: ${error}`));
      }
    });

    // Send MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    mcpProcess.stdin.end();
  });
}

async function main() {
  try {
    console.log('🚀 Testing Microservice Generator MCP...\n');

    // Test 1: Analyze Input
    console.log('1️⃣ Testing analyze-input...');
    const analysisResult = await callMCPTool('analyze-input', {
      inputPath: INPUT_PATH
    });
    console.log('Analysis result:', analysisResult);

    // Test 2: Generate Microservice
    console.log('\n2️⃣ Testing generate-microservice...');
    const generationResult = await callMCPTool('generate-microservice', {
      inputPath: INPUT_PATH,
      outputPath: OUTPUT_PATH
    });
    console.log('Generation result:', generationResult);

    // Test 3: Validate Output
    console.log('\n3️⃣ Testing validate-output...');
    const validationResult = await callMCPTool('validate-output', {
      outputPath: OUTPUT_PATH
    });
    console.log('Validation result:', validationResult);

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

main();
