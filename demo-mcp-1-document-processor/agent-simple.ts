import { createInterface } from 'readline';
import fs from 'fs/promises';
import path from 'path';

interface MCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

class SimpleDocumentProcessorAgent {
  private rl: any;
  
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.log('🤖 MCP Document Processor Agent');
    console.log('================================\n');
    
    console.log('¡Bienvenido al Agente MCP Document Processor!');
    console.log('Este agente te permite usar las herramientas MCP de forma interactiva.\n');
    
    console.log('🔧 Herramientas disponibles:');
    console.log('  1. Procesar archivo Excel específico');
    console.log('  2. Analizar carpeta de entrada');
    console.log('');
    
    await this.showMainMenu();
  }

  private async showMainMenu() {
    while (true) {
      console.log('\n📋 MENÚ PRINCIPAL');
      console.log('==================');
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
          console.log('❌ Opción inválida. Por favor selecciona 1-6.');
      }
    }
  }

  private async processExcelFile() {
    console.log('\n📊 PROCESAMIENTO DE ARCHIVO EXCEL');
    console.log('==================================');
    
    try {
      // Mostrar archivos disponibles
      const files = await fs.readdir('input-specifications');
      const excelFiles = files.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
      
      if (excelFiles.length === 0) {
        console.log('⚠️  No hay archivos Excel en input-specifications/');
        console.log('   Coloca tus archivos .xlsx en esa carpeta primero.');
        return;
      }
      
      console.log(`📄 Archivos Excel disponibles (${excelFiles.length}):`);
      excelFiles.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file}`);
      });
      
      const fileChoice = await this.promptUser('\n➤ Selecciona el número del archivo a procesar: ');
      const fileIndex = parseInt(fileChoice.trim()) - 1;
      
      if (fileIndex < 0 || fileIndex >= excelFiles.length) {
        console.log('❌ Número de archivo inválido');
        return;
      }
      
      const selectedFile = excelFiles[fileIndex];
      const filePath = `input-specifications/${selectedFile}`;
      
      console.log(`\n🔄 Procesando: ${selectedFile}`);
      console.log('━'.repeat(50));
      
      // Llamar al MCP
      const result = await this.callMCPTool('process_microservice_specification', { filePath });
      
      if (result.isError) {
        console.log('❌ Error procesando archivo:');
        console.log(result.content[0]?.text || 'Error desconocido');
      } else {
        console.log('✅ Archivo procesado exitosamente!');
        console.log(result.content[0]?.text || 'Procesamiento completado');
      }
      
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  private async analyzeInputFolder() {
    console.log('\n📂 ANÁLISIS DE CARPETA DE ENTRADA');
    console.log('=================================');
    
    try {
      console.log('🔍 Analizando carpeta input-specifications...');
      
      const result = await this.callMCPTool('analyze_input_folder', {});
      
      if (result.isError) {
        console.log('❌ Error analizando carpeta:');
        console.log(result.content[0]?.text || 'Error desconocido');
      } else {
        console.log(result.content[0]?.text || 'Análisis completado');
      }
      
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  private async showGeneratedFiles() {
    console.log('\n📄 ARCHIVOS JSON GENERADOS');
    console.log('===========================');
    
    try {
      const files = await fs.readdir('output-json');
      const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'README.md');
      
      if (jsonFiles.length === 0) {
        console.log('⚠️  No hay archivos JSON generados aún');
        console.log('   Procesa algunos archivos Excel primero.');
        return;
      }
      
      console.log(`📊 Archivos JSON encontrados (${jsonFiles.length}):`);
      
      for (const file of jsonFiles) {
        const filePath = path.join('output-json', file);
        const stats = await fs.stat(filePath);
        const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
        
        console.log(`\n📄 ${file}`);
        console.log(`   📊 Tamaño: ${sizeKB} KB`);
        console.log(`   ⏰ Creado: ${stats.birthtime.toLocaleString()}`);
        
        // Mostrar preview del contenido
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const spec = JSON.parse(content);
          console.log(`   🔧 Servicio: ${spec.microservice?.name || 'N/A'}`);
          console.log(`   📡 Endpoints: ${spec.endpoints?.length || 0}`);
          console.log(`   🔗 Integraciones: ${spec.integrations?.length || 0}`);
        } catch {
          console.log('   ⚠️  Error leyendo contenido');
        }
      }
      
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  private async validateMCP() {
    console.log('\n🔍 VALIDACIÓN DEL MCP');
    console.log('====================');
    
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
    console.log('📋 Resultados de validación:');
    console.log('━'.repeat(30));
    
    checks.forEach(check => {
      const icon = check.status === 'ok' ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
    });
    
    const passed = checks.filter(c => c.status === 'ok').length;
    console.log(`\n📊 Resumen: ${passed}/${checks.length} verificaciones pasaron`);
    
    if (passed === checks.length) {
      console.log('🎉 ¡MCP completamente funcional!');
    } else {
      console.log('⚠️  Algunas verificaciones requieren atención');
    }
  }

  private async showHelp() {
    console.log('\n📖 AYUDA DEL AGENTE MCP');
    console.log('=======================');
    
    console.log('\n🎯 Propósito:');
    console.log('Este agente te permite usar el MCP Document Processor de forma interactiva.');
    console.log('Procesa archivos Excel con especificaciones técnicas y genera JSON estructurado.');
    
    console.log('\n📁 Estructura de carpetas:');
    console.log('  input-specifications/  - Coloca aquí tus archivos Excel (.xlsx)');
    console.log('  output-json/           - Los JSON generados aparecen aquí');
    
    console.log('\n🔧 Herramientas disponibles:');
    console.log('  1. Procesar Excel      - Convierte Excel a JSON estructurado');
    console.log('  2. Analizar carpeta    - Ve qué archivos están disponibles');
    console.log('  3. Ver JSON generados  - Revisa los resultados');
    console.log('  4. Validar MCP         - Verifica que todo funcione');
    
    console.log('\n📊 Formato Excel esperado:');
    console.log('  Hoja 1: Información del servicio (nombre, descripción, puerto, etc.)');
    console.log('  Hoja 2: Endpoints REST (método, ruta, descripción, parámetros)');
    console.log('  Hoja 3: Integraciones (sistemas externos, bases de datos)');
    
    console.log('\n🚀 Flujo recomendado:');
    console.log('  1. Coloca archivos Excel en input-specifications/');
    console.log('  2. Usa "Analizar carpeta" para ver archivos disponibles');
    console.log('  3. Usa "Procesar Excel" para convertir a JSON');
    console.log('  4. Usa "Ver JSON generados" para revisar resultados');
  }

  private async callMCPTool(toolName: string, args: any): Promise<MCPResponse> {
    console.log(`🔄 Ejecutando herramienta: ${toolName}`);
    
    try {
      if (toolName === 'process_microservice_specification') {
        // Importar dinámicamente el procesador
        const indexModule = await import('./dist/index.js');
        const processor = new indexModule.DocumentProcessor();
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

  private async promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer: string) => {
        resolve(answer);
      });
    });
  }

  private async exit() {
    console.log('\n👋 ¡Gracias por usar el Agente MCP Document Processor!');
    console.log('Tus archivos JSON están guardados en output-json/');
    console.log('¡Hasta la próxima! 🚀\n');
    
    this.rl.close();
    process.exit(0);
  }
}

// Iniciar el agente
async function main() {
  const agent = new SimpleDocumentProcessorAgent();
  await agent.start();
}

main().catch(console.error);
