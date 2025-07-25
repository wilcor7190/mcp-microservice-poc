import { spawn } from 'child_process';
import path from 'path';

// Test MCP tools directly
async function testMCPTools() {
  console.log('🧪 Testing MCP Tools from Copilot\n');

  const mcpPath = path.join(process.cwd(), 'dist', 'index.js');
  const inputPath = path.resolve('..', 'input');
  const outputPath = path.resolve('..', 'output');

  console.log(`MCP Path: ${mcpPath}`);
  console.log(`Input Path: ${inputPath}`);
  console.log(`Output Path: ${outputPath}\n`);

  // Test 1: Get generation status
  console.log('📊 Test 1: Get Generation Status');
  await testTool('get-generation-status', {});

  // Test 2: Get patterns
  console.log('\n📋 Test 2: Get Patterns');
  await testTool('get-patterns', {});

  // Test 3: Analyze input
  console.log('\n🔍 Test 3: Analyze Input');
  await testTool('analyze-input', { inputPath });

  // Test 4: Generate microservice
  console.log('\n🛠️ Test 4: Generate Microservice');
  await testTool('generate-microservice', { inputPath, outputPath });

  // Test 5: Validate output
  console.log('\n✅ Test 5: Validate Output');
  await testTool('validate-output', { outputPath });
}

async function testTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(process.cwd(), 'dist', 'index.js')], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    child.stdin.write(JSON.stringify(request) + '\n');
    child.stdin.end();

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (errorOutput && !errorOutput.includes('🚀 Microservice Generator MCP Server started')) {
        console.error(`❌ Error: ${errorOutput}`);
      }

      try {
        const lines = output.split('\n').filter(line => line.trim());
        for (const line of lines) {
          if (line.startsWith('{')) {
            const response = JSON.parse(line);
            if (response.result) {
              console.log(`✅ Success: ${toolName}`);
              if (response.result.content) {
                response.result.content.forEach(content => {
                  if (content.type === 'text') {
                    console.log(content.text.substring(0, 200) + '...');
                  }
                });
              } else {
                console.log(JSON.stringify(response.result, null, 2).substring(0, 200) + '...');
              }
            } else if (response.error) {
              console.log(`❌ Error: ${response.error.message}`);
            }
            resolve(response);
            return;
          }
        }
        resolve({ raw: output });
      } catch (error) {
        console.error(`❌ Parse error: ${error.message}`);
        reject(error);
      }
    });
  });
}

// Run tests
testMCPTools().catch(console.error);
