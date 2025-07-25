#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

async function demonstrateMCP() {
  console.log('🚀 Demostración del MCP Document Processor\n');
  
  try {
    // Verificar que existen los archivos de ejemplo
    const inputDir = 'input-specifications';
    const outputDir = 'output-json';
    
    console.log('📂 Verificando estructura de carpetas...');
    console.log('━'.repeat(50));
    
    const inputExists = await fs.access(inputDir).then(() => true).catch(() => false);
    const outputExists = await fs.access(outputDir).then(() => true).catch(() => false);
    
    console.log(`📁 ${inputDir}: ${inputExists ? '✅ Existe' : '❌ No existe'}`);
    console.log(`📁 ${outputDir}: ${outputExists ? '✅ Existe' : '❌ No existe'}`);
    
    if (inputExists) {
      const files = await fs.readdir(inputDir);
      const excelFiles = files.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
      
      console.log(`\n📄 Archivos en ${inputDir}:`);
      if (files.length === 0) {
        console.log('   (vacía)');
      } else {
        files.forEach(file => {
          const isExcel = file.endsWith('.xlsx') || file.endsWith('.xls');
          console.log(`   ${isExcel ? '📊' : '📄'} ${file}`);
        });
      }
      
      console.log(`\n📊 Archivos Excel encontrados: ${excelFiles.length}`);
      
      if (excelFiles.length > 0) {
        console.log('\n🔄 Para procesar estos archivos:');
        console.log('━'.repeat(50));
        console.log('1. Compila el proyecto: npm run build');
        console.log('2. Ejecuta el MCP: node dist/index.js');
        console.log('3. Usa la herramienta "process_microservice_specification"');
        console.log('4. Especifica la ruta completa del archivo Excel');
        
        console.log('\n📋 Ejemplo de uso:');
        console.log('━'.repeat(30));
        excelFiles.forEach(file => {
          console.log(`Archivo: ${inputDir}/${file}`);
        });
      }
    }
    
    if (outputExists) {
      const outputFiles = await fs.readdir(outputDir);
      console.log(`\n📤 Archivos en ${outputDir}: ${outputFiles.length}`);
      if (outputFiles.length > 0) {
        outputFiles.forEach(file => {
          console.log(`   📄 ${file}`);
        });
      }
    }
    
    console.log('\n🎯 FLUJO COMPLETO:');
    console.log('━'.repeat(50));
    console.log('1. 📊 Coloca archivos Excel en input-specifications/');
    console.log('2. 🔄 Ejecuta el MCP Document Processor');
    console.log('3. 📤 Revisa los JSON generados en output-json/');
    console.log('4. 🚀 Usa esos JSON como entrada para el siguiente MCP');
    
    console.log('\n📖 ESTRUCTURA ESPERADA DEL EXCEL:');
    console.log('━'.repeat(50));
    console.log('Hoja 1 "Servicio": Información general del microservicio');
    console.log('Hoja 2 "Endpoints": Lista de endpoints REST');
    console.log('Hoja 3 "Integraciones": Sistemas externos y bases de datos');
    
    console.log('\n✅ Demostración completada!');
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Ejecutar demostración
demonstrateMCP().catch(console.error);
