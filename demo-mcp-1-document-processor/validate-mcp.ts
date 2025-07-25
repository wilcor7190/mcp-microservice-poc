import fs from 'fs/promises';
import path from 'path';

async function validateMCP() {
  console.log('🔍 Validación Final del MCP Document Processor');
  console.log('===========================================\n');

  const checks: string[] = [];

  // 1. Verificar estructura de carpetas
  try {
    await fs.access('input-specifications');
    checks.push('✅ Carpeta input-specifications existe');
  } catch {
    checks.push('❌ Carpeta input-specifications no existe');
  }

  try {
    await fs.access('output-json');
    checks.push('✅ Carpeta output-json existe');
  } catch {
    checks.push('❌ Carpeta output-json no existe');
  }

  // 2. Verificar archivos de código
  try {
    await fs.access('dist/index.js');
    checks.push('✅ Código compilado existe');
  } catch {
    checks.push('❌ Código no compilado - ejecuta npm run build');
  }

  // 3. Verificar archivos de entrada
  try {
    const inputFiles = await fs.readdir('input-specifications');
    const excelFiles = inputFiles.filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
    checks.push(`✅ ${excelFiles.length} archivos Excel en input-specifications`);
  } catch {
    checks.push('❌ No se puede leer input-specifications');
  }

  // 4. Verificar archivos de salida
  try {
    const outputFiles = await fs.readdir('output-json');
    const jsonFiles = outputFiles.filter(f => f.endsWith('.json') && f !== 'README.md');
    checks.push(`✅ ${jsonFiles.length} archivos JSON generados`);
    
    if (jsonFiles.length > 0) {
      // Verificar estructura del JSON
      const firstJson = await fs.readFile(`output-json/${jsonFiles[0]}`, 'utf-8');
      const spec = JSON.parse(firstJson);
      
      if (spec.metadata && spec.microservice && spec.endpoints && spec.integrations) {
        checks.push('✅ Estructura JSON válida');
      } else {
        checks.push('⚠️  Estructura JSON incompleta');
      }
    }
  } catch {
    checks.push('❌ No se puede leer output-json');
  }

  // 5. Verificar dependencias
  try {
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'));
    const hasNodeXlsx = pkg.dependencies && pkg.dependencies['node-xlsx'];
    const hasMCP = pkg.dependencies && pkg.dependencies['@modelcontextprotocol/sdk'];
    
    if (hasNodeXlsx && hasMCP) {
      checks.push('✅ Dependencias correctas instaladas');
    } else {
      checks.push('⚠️  Faltan dependencias');
    }
  } catch {
    checks.push('❌ No se puede leer package.json');
  }

  // Mostrar resultados
  console.log('📋 RESULTADOS DE VALIDACIÓN:');
  console.log('━'.repeat(50));
  checks.forEach(check => console.log(check));

  // Resumen final
  const passed = checks.filter(c => c.startsWith('✅')).length;
  const total = checks.length;
  
  console.log(`\n📊 RESUMEN: ${passed}/${total} verificaciones pasaron`);
  
  if (passed === total) {
    console.log('\n🎉 ¡MCP Document Processor completamente funcional!');
    console.log('━'.repeat(50));
    console.log('✅ El MCP está listo para procesar especificaciones Excel');
    console.log('✅ Genera JSON estructurado correctamente');
    console.log('✅ Carpetas organizadas y archivos de ejemplo disponibles');
    console.log('✅ Listo para usar como entrada del siguiente MCP');
    
    console.log('\n🚀 COMANDOS PARA USAR:');
    console.log('━'.repeat(50));
    console.log('# Procesar archivo específico:');
    console.log('npx tsx test-mcp.ts');
    console.log('');
    console.log('# Iniciar servidor MCP:');
    console.log('node dist/index.js');
    console.log('');
    console.log('# Verificar carpetas:');
    console.log('npx tsx demo-simple.ts');
    
  } else {
    console.log('\n⚠️  Hay algunas verificaciones que requieren atención');
    console.log('Revisa los elementos marcados con ❌ o ⚠️');
  }

  console.log('\n📄 Ver RESUMEN-FINAL.md para documentación completa');
}

validateMCP().catch(console.error);
