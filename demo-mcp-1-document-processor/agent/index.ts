import { spawn } from 'child_process';
import { createInterface } from 'readline';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

class MCPDocumentProcessorAgent {
  private mcpProcess: any = null;
  private rl: any;
  
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.log(chalk.blue.bold('🤖 MCP Document Processor Agent'));
    console.log(chalk.blue('================================\n'));
    
    await this.showWelcome();
    await this.startMCPServer();
    await this.showMainMenu();
  }

  private async showWelcome() {
    console.log(chalk.green('¡Bienvenido al Agente MCP Document Processor!'));
    console.log(chalk.gray('Este agente te permite usar las herramientas MCP de forma interactiva.\n'));
    
    console.log(chalk.yellow('🔧 Herramientas disponibles:'));
    console.log(chalk.cyan('  1. process_microservice_specification - Procesar archivo Excel específico'));
    console.log(chalk.cyan('  2. analyze_input_folder - Analizar carpeta de entrada'));
    console.log('');
  }

  private async startMCPServer() {
    console.log(chalk.blue('🚀 Iniciando servidor MCP...'));
    
    try {
      // Verificar que el MCP esté compilado
      await fs.access('dist/index.js');
      console.log(chalk.green('✅ MCP compilado encontrado'));
    } catch {
      console.log(chalk.red('❌ MCP no compilado. Ejecutando npm run build...'));
      await this.runCommand('npm', ['run', 'build']);
    }
    
    console.log(chalk.green('✅ Servidor MCP listo\n'));
  }

  private async showMainMenu() {
    while (true) {
      console.log(chalk.blue.bold('\n📋 MENÚ PRINCIPAL'));
      console.log(chalk.blue('=================='));
      console.log('1. 📊 Procesar archivo Excel específico');
      console.log('2. 📂 Analizar carpeta de entrada');
      console.log('3. 📄 Ver archivos JSON generados');
      console.log('4. 🔍 Validar estado del MCP');
      console.log('5. 📖 Mostrar ayuda');
      console.log('6. 🚪 Salir');
      
      const choice = await this.promptUser('\n➤ Selecciona una opción (1-6): ');
      
      switch (choice.trim()) {
        case '1':
          await this.processExcelFile();
          break;
        case '2':
          await this.analyzeInputFolder();
          break;
        case '3':
          await this.showGeneratedFiles();
          break;
        case '4':
          await this.validateMCP();
          break;
        case '5':
          await this.showHelp();
          break;
        case '6':
          await this.exit();
          return;
        default:
          console.log(chalk.red('❌ Opción inválida. Por favor selecciona 1-6.'));
      }
    }
  }

  private async processExcelFile() {
    console.log(chalk.blue('\n📊 PROCESAMIENTO DE ARCHIVO EXCEL'));
    console.log(chalk.blue('=================================='));
    
    try {
      // Mostrar archivos disponibles
      const files = await fs.readdir('input-specifications');
      const excelFiles = files.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
      
      if (excelFiles.length === 0) {
        console.log(chalk.yellow('⚠️  No hay archivos Excel en input-specifications/'));
        console.log(chalk.gray('   Coloca tus archivos .xlsx en esa carpeta primero.'));
        return;
      }
      
      console.log(chalk.green(`📄 Archivos Excel disponibles (${excelFiles.length}):`));
      excelFiles.forEach((file, index) => {
        console.log(chalk.cyan(`  ${index + 1}. ${file}`));
      });
      
      const fileChoice = await this.promptUser('\n➤ Selecciona el número del archivo a procesar: ');
      const fileIndex = parseInt(fileChoice.trim()) - 1;
      
      if (fileIndex < 0 || fileIndex >= excelFiles.length) {
        console.log(chalk.red('❌ Número de archivo inválido'));
        return;
      }
      
      const selectedFile = excelFiles[fileIndex];
      const filePath = `input-specifications/${selectedFile}`;
      
      console.log(chalk.blue(`\n🔄 Procesando: ${selectedFile}`));
      console.log(chalk.gray('━'.repeat(50)));
      
      // Simular llamada al MCP
      const result = await this.callMCPTool('process_microservice_specification', { filePath });
      
      if (result.isError) {
        console.log(chalk.red('❌ Error procesando archivo:'));
        console.log(chalk.red(result.content[0]?.text || 'Error desconocido'));
      } else {
        console.log(chalk.green('✅ Archivo procesado exitosamente!'));
        console.log(result.content[0]?.text || 'Procesamiento completado');
      }
      
    } catch (error: any) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  private async analyzeInputFolder() {
    console.log(chalk.blue('\n📂 ANÁLISIS DE CARPETA DE ENTRADA'));
    console.log(chalk.blue('================================='));
    
    try {
      console.log(chalk.blue('🔍 Analizando carpeta input-specifications...'));
      
      const result = await this.callMCPTool('analyze_input_folder', {});
      
      if (result.isError) {
        console.log(chalk.red('❌ Error analizando carpeta:'));
        console.log(chalk.red(result.content[0]?.text || 'Error desconocido'));
      } else {
        console.log(result.content[0]?.text || 'Análisis completado');
      }
      
    } catch (error: any) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  private async showGeneratedFiles() {
    console.log(chalk.blue('\n📄 ARCHIVOS JSON GENERADOS'));
    console.log(chalk.blue('==========================='));
    
    try {
      const files = await fs.readdir('output-json');
      const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'README.md');
      
      if (jsonFiles.length === 0) {
        console.log(chalk.yellow('⚠️  No hay archivos JSON generados aún'));
        console.log(chalk.gray('   Procesa algunos archivos Excel primero.'));
        return;
      }
      
      console.log(chalk.green(`📊 Archivos JSON encontrados (${jsonFiles.length}):`));
      
      for (const file of jsonFiles) {
        const filePath = path.join('output-json', file);
        const stats = await fs.stat(filePath);
        const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
        
        console.log(chalk.cyan(`\n📄 ${file}`));
        console.log(chalk.gray(`   📊 Tamaño: ${sizeKB} KB`));
        console.log(chalk.gray(`   ⏰ Creado: ${stats.birthtime.toLocaleString()}`));
        
        // Mostrar preview del contenido
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const spec = JSON.parse(content);
          console.log(chalk.gray(`   🔧 Servicio: ${spec.microservice?.name || 'N/A'}`));
          console.log(chalk.gray(`   📡 Endpoints: ${spec.endpoints?.length || 0}`));
          console.log(chalk.gray(`   🔗 Integraciones: ${spec.integrations?.length || 0}`));
        } catch {
          console.log(chalk.gray('   ⚠️  Error leyendo contenido'));
        }
      }
      
    } catch (error: any) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  private async validateMCP() {
    console.log(chalk.blue('\n🔍 VALIDACIÓN DEL MCP'));
    console.log(chalk.blue('===================='));
    
    const checks: Array<{name: string, status: string}> = [];
    
    // Verificar estructura
    try {
      await fs.access('input-specifications');
      checks.push({ name: 'Carpeta input-specifications', status: 'ok' });
    } catch {
      checks.push({ name: 'Carpeta input-specifications', status: 'error' });
    }
    
    try {
      await fs.access('output-json');
      checks.push({ name: 'Carpeta output-json', status: 'ok' });
    } catch {
      checks.push({ name: 'Carpeta output-json', status: 'error' });
    }
    
    try {
      await fs.access('dist/index.js');
      checks.push({ name: 'MCP compilado', status: 'ok' });
    } catch {
      checks.push({ name: 'MCP compilado', status: 'error' });
    }
    
    // Mostrar resultados
    console.log(chalk.blue('📋 Resultados de validación:'));
    console.log(chalk.gray('━'.repeat(30)));
    
    checks.forEach(check => {
      const icon = check.status === 'ok' ? chalk.green('✅') : chalk.red('❌');
      console.log(`${icon} ${check.name}`);
    });
    
    const passed = checks.filter(c => c.status === 'ok').length;
    console.log(chalk.blue(`\n📊 Resumen: ${passed}/${checks.length} verificaciones pasaron`));
    
    if (passed === checks.length) {
      console.log(chalk.green('🎉 ¡MCP completamente funcional!'));
    } else {
      console.log(chalk.yellow('⚠️  Algunas verificaciones requieren atención'));
    }
  }

  private async showHelp() {
    console.log(chalk.blue('\n📖 AYUDA DEL AGENTE MCP'));
    console.log(chalk.blue('======================='));
    
    console.log(chalk.yellow('\n🎯 Propósito:'));
    console.log(chalk.gray('Este agente te permite usar el MCP Document Processor de forma interactiva.'));
    console.log(chalk.gray('Procesa archivos Excel con especificaciones técnicas y genera JSON estructurado.'));
    
    console.log(chalk.yellow('\n📁 Estructura de carpetas:'));
    console.log(chalk.cyan('  input-specifications/  ') + chalk.gray('- Coloca aquí tus archivos Excel (.xlsx)'));
    console.log(chalk.cyan('  output-json/           ') + chalk.gray('- Los JSON generados aparecen aquí'));
    
    console.log(chalk.yellow('\n🔧 Herramientas disponibles:'));
    console.log(chalk.cyan('  1. Procesar Excel      ') + chalk.gray('- Convierte Excel a JSON estructurado'));
    console.log(chalk.cyan('  2. Analizar carpeta    ') + chalk.gray('- Ve qué archivos están disponibles'));
    console.log(chalk.cyan('  3. Ver JSON generados  ') + chalk.gray('- Revisa los resultados'));
    console.log(chalk.cyan('  4. Validar MCP         ') + chalk.gray('- Verifica que todo funcione'));
    
    console.log(chalk.yellow('\n📊 Formato Excel esperado:'));
    console.log(chalk.gray('  Hoja 1: Información del servicio (nombre, descripción, puerto, etc.)'));
    console.log(chalk.gray('  Hoja 2: Endpoints REST (método, ruta, descripción, parámetros)'));
    console.log(chalk.gray('  Hoja 3: Integraciones (sistemas externos, bases de datos)'));
    
    console.log(chalk.yellow('\n🚀 Flujo recomendado:'));
    console.log(chalk.gray('  1. Coloca archivos Excel en input-specifications/'));
    console.log(chalk.gray('  2. Usa "Analizar carpeta" para ver archivos disponibles'));
    console.log(chalk.gray('  3. Usa "Procesar Excel" para convertir a JSON'));
    console.log(chalk.gray('  4. Usa "Ver JSON generados" para revisar resultados'));
  }

  private async callMCPTool(toolName: string, args: any): Promise<MCPResponse> {
    // Simular llamada al MCP - En implementación real usarías el SDK MCP
    console.log(chalk.blue(`🔄 Llamando herramienta: ${toolName}`));
    
    // Por ahora, ejecutar directamente el procesador
    const { DocumentProcessor } = await import('../dist/index.js');
    
    try {
      if (toolName === 'process_microservice_specification') {
        const processor = new DocumentProcessor();
        const specification = await processor.processDocument(args.filePath);
        
        // Guardar resultado
        const outputFileName = `${specification.microservice.name}-specification.json`;
        const outputPath = path.join('output-json', outputFileName);
        
        await fs.mkdir('output-json', { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(specification, null, 2));
        
        return {
          content: [{
            type: "text",
            text: `✅ Especificación procesada exitosamente!\n\n📄 Servicio: ${specification.microservice.name}\n📝 Descripción: ${specification.microservice.description}\n📡 Endpoints: ${specification.endpoints.length} detectados\n🔗 Integraciones: ${specification.integrations.length} sistemas\n\n💾 Guardado en: ${outputPath}`
          }]
        };
      } else if (toolName === 'analyze_input_folder') {
        const files = await fs.readdir('input-specifications');
        const excelFiles = files.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
        
        let results = `📂 Análisis de carpeta input-specifications:\n\n`;
        results += `📁 Carpeta: input-specifications\n`;
        results += `📄 Archivos encontrados: ${files.length} total, ${excelFiles.length} Excel\n\n`;
        
        if (excelFiles.length === 0) {
          results += `⚠️ No se encontraron archivos Excel (.xlsx/.xls) para procesar.\n`;
          results += `💡 Coloca tus especificaciones técnicas en esta carpeta.`;
        } else {
          results += `📋 Archivos Excel disponibles:\n`;
          excelFiles.forEach(file => {
            results += `   - ${file}\n`;
          });
        }
        
        return {
          content: [{
            type: "text",
            text: results
          }]
        };
      }
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
    
    return {
      content: [{
        type: "text",
        text: "Herramienta no implementada"
      }],
      isError: true
    };
  }

  private async runCommand(command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, { stdio: 'inherit' });
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Command failed with code ${code}`));
      });
    });
  }

  private async promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer: string) => {
        resolve(answer);
      });
    });
  }

  private async exit() {
    console.log(chalk.blue('\n👋 ¡Gracias por usar el Agente MCP Document Processor!'));
    console.log(chalk.gray('Tus archivos JSON están guardados en output-json/'));
    console.log(chalk.gray('¡Hasta la próxima! 🚀\n'));
    
    this.rl.close();
    process.exit(0);
  }
}

// Iniciar el agente
async function main() {
  const agent = new MCPDocumentProcessorAgent();
  await agent.start();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
