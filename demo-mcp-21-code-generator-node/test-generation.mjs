import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas
const mcpPath = path.join(__dirname, 'microservice-generator-mcp', 'dist', 'index.js');
const inputPath = path.join(__dirname, 'input');
const outputPath = path.join(__dirname, 'output');

console.log('🚀 Testing MCP Microservice Generation...');
console.log(`MCP Path: ${mcpPath}`);
console.log(`Input Path: ${inputPath}`);
console.log(`Output Path: ${outputPath}`);

// Test: Generate microservice
async function testGenerateMicroservice() {
  console.log('\n🛠️ Generating Microservice');
  
  const child = spawn('node', [mcpPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: __dirname
  });

  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'generate-microservice',
      arguments: {
        inputPath: inputPath,
        outputPath: outputPath
      }
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
    console.error('Error:', data.toString());
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
      
      if (errorOutput) {
        console.log('Error output:', errorOutput);
      }
      
      try {
        const lines = output.split('\n').filter(line => line.trim());
        for (const line of lines) {
          if (line.startsWith('{')) {
            const response = JSON.parse(line);
            console.log('Response:', JSON.stringify(response, null, 2));
            resolve(response);
            return;
          }
        }
        console.log('Raw output:', output);
        resolve({ raw: output });
      } catch (error) {
        console.error('Failed to parse output:', error);
        console.log('Raw output:', output);
        reject(error);
      }
    });
  });
}

// Run generation test
testGenerateMicroservice().catch(console.error);
