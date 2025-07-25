import { DocumentProcessor, MicroserviceSpecification } from './dist/index.js';
import fs from 'fs/promises';
import path from 'path';

async function testMCP() {
  console.log('🧪 Prueba del MCP Document Processor');
  console.log('==================================\n');
  
  const processor = new DocumentProcessor();
  
  try {
    // Verificar archivos disponibles
    console.log('📁 Verificando archivos de entrada...');
    const inputFiles = await fs.readdir('input-specifications');
    const excelFiles = inputFiles.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
    
    console.log(`✅ Archivos Excel encontrados: ${excelFiles.length}`);
    excelFiles.forEach(file => console.log(`   📊 ${file}`));
    
    if (excelFiles.length === 0) {
      console.log('❌ No hay archivos Excel para procesar');
      return;
    }
    
    // Procesar el primer archivo encontrado
    const testFile = `input-specifications/${excelFiles[0]}`;
    console.log(`\n🔄 Procesando archivo: ${excelFiles[0]}`);
    console.log('━'.repeat(50));
    
    const specification = await processor.processDocument(testFile);
    
    // Guardar resultado
    const outputFile = `output-json/${specification.microservice.name}-specification.json`;
    await fs.mkdir('output-json', { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify(specification, null, 2));
    
    console.log('✅ Procesamiento exitoso!\n');
    
    // Mostrar resumen detallado
    console.log('📊 ESPECIFICACIÓN GENERADA:');
    console.log('━'.repeat(50));
    console.log(`🔧 Servicio: ${specification.microservice.name}`);
    console.log(`📝 Descripción: ${specification.microservice.description}`);
    console.log(`🏷️  Versión: ${specification.microservice.version}`);
    console.log(`🔌 Puerto: ${specification.microservice.port}`);
    console.log(`👥 Equipo: ${specification.microservice.team}`);
    console.log(`🏗️  Arquitectura: ${specification.architecture.pattern}`);
    console.log(`🛠️  Framework: ${specification.architecture.framework}`);
    console.log(`🗄️  Base de datos: ${specification.architecture.database}`);
    
    console.log(`\n📡 ENDPOINTS (${specification.endpoints.length} total):`);
    console.log('━'.repeat(50));
    specification.endpoints.slice(0, 5).forEach((endpoint, index) => {
      console.log(`${index + 1}. ${endpoint.method} ${endpoint.path}`);
      console.log(`   📝 ${endpoint.description}`);
      if (endpoint.parameters.length > 0) {
        console.log(`   📋 Parámetros: ${endpoint.parameters.join(', ')}`);
      }
    });
    if (specification.endpoints.length > 5) {
      console.log(`   ... y ${specification.endpoints.length - 5} endpoints más`);
    }
    
    console.log(`\n🔗 INTEGRACIONES (${specification.integrations.length} total):`);
    console.log('━'.repeat(50));
    specification.integrations.forEach((integration, index) => {
      console.log(`${index + 1}. ${integration.name} (${integration.type})`);
      console.log(`   🔌 ${integration.connection}`);
    });
    
    console.log(`\n💾 ARCHIVO GENERADO:`);
    console.log('━'.repeat(50));
    console.log(`📄 Archivo: ${outputFile}`);
    const stats = await fs.stat(outputFile);
    console.log(`📊 Tamaño: ${Math.round(stats.size / 1024 * 100) / 100} KB`);
    console.log(`⏰ Creado: ${stats.birthtime.toLocaleString()}`);
    
    console.log(`\n🎯 PRÓXIMOS PASOS:`);
    console.log('━'.repeat(50));
    console.log('1. ✅ Especificación extraída y validada');
    console.log('2. 🔄 JSON estructurado generado');
    console.log('3. 🚀 Listo para el siguiente MCP de generación de código');
    console.log('4. 📋 El JSON contiene toda la información necesaria para generar:');
    console.log('   - Estructura del proyecto');
    console.log('   - Controladores REST');
    console.log('   - Servicios de negocio');
    console.log('   - Repositorios de datos');
    console.log('   - Configuración de integraciones');
    console.log('   - Tests unitarios e integración');
    
    console.log('\n✅ Prueba completada exitosamente!');
    
  } catch (error: any) {
    console.error(`❌ Error en la prueba: ${error.message}`);
    console.error(error.stack);
  }
}

// Ejecutar prueba
testMCP().catch(console.error);
