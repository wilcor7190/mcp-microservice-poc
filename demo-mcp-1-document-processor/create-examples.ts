import * as XLSX from 'xlsx';
import fs from 'fs/promises';

// Crear un archivo Excel de ejemplo con especificaciones técnicas
async function createExampleExcel() {
  console.log('📊 Creando archivo Excel de ejemplo...');
  
  // Datos del servicio
  const serviceData = [
    ['Servicio', 'Descripción', 'Versión', 'Puerto', 'Equipo', 'Repositorio'],
    [
      'user-management-service',
      'Microservicio para gestión completa de usuarios, incluyendo autenticación, autorización y perfil de usuario',
      '1.2.0',
      3001,
      'Backend Team Alpha',
      'https://github.com/company/user-management-service'
    ]
  ];
  
  // Datos de endpoints
  const endpointsData = [
    ['Método', 'Ruta', 'Descripción', 'Parámetros', 'Respuesta'],
    ['GET', '/api/v1/users', 'Obtener lista paginada de usuarios', 'page:int;size:int;sort:string', '200: Lista de usuarios obtenida'],
    ['POST', '/api/v1/users', 'Crear nuevo usuario en el sistema', 'body: UserCreateDTO', '201: Usuario creado exitosamente'],
    ['GET', '/api/v1/users/{id}', 'Obtener usuario específico por ID', 'id: string (UUID)', '200: Usuario encontrado'],
    ['PUT', '/api/v1/users/{id}', 'Actualizar información de usuario', 'id: string; body: UserUpdateDTO', '200: Usuario actualizado'],
    ['DELETE', '/api/v1/users/{id}', 'Eliminar usuario del sistema', 'id: string (UUID)', '204: Usuario eliminado'],
    ['POST', '/api/v1/users/{id}/activate', 'Activar cuenta de usuario', 'id: string', '200: Usuario activado'],
    ['POST', '/api/v1/users/{id}/deactivate', 'Desactivar cuenta de usuario', 'id: string', '200: Usuario desactivado'],
    ['GET', '/api/v1/users/{id}/profile', 'Obtener perfil detallado de usuario', 'id: string', '200: Perfil de usuario'],
    ['PUT', '/api/v1/users/{id}/password', 'Cambiar contraseña de usuario', 'id: string; body: PasswordChangeDTO', '200: Contraseña actualizada'],
    ['GET', '/api/v1/health', 'Health check del microservicio', '', '200: Servicio funcionando correctamente'],
    ['GET', '/api/v1/metrics', 'Métricas del servicio para monitoreo', '', '200: Métricas del sistema']
  ];
  
  // Datos de integraciones
  const integrationsData = [
    ['Sistema', 'Tipo', 'Conexión', 'Descripción', 'Configuración'],
    [
      'user-database',
      'database',
      'postgresql://db-cluster.company.local:5432/users_db',
      'Base de datos principal para almacenamiento de usuarios',
      'pool-size: 20; timeout: 5000ms'
    ],
    [
      'auth-service',
      'rest-api',
      'https://auth-service.company.local/v1',
      'Servicio de autenticación y generación de tokens JWT',
      'timeout: 3000ms; retry: 3'
    ],
    [
      'notification-service',
      'message-queue',
      'rabbitmq://mq-cluster.company.local:5672/user-events',
      'Cola de mensajes para notificaciones de eventos de usuario',
      'prefetch: 50; durable: true'
    ],
    [
      'ldap-server',
      'ldap',
      'ldap://ldap.company.local:389',
      'Servidor LDAP corporativo para autenticación empresarial',
      'bind-dn: cn=service,ou=apps,dc=company,dc=local'
    ],
    [
      'redis-cache',
      'cache',
      'redis://cache-cluster.company.local:6379',
      'Cache distribuido para sesiones y datos temporales',
      'ttl: 3600s; cluster-mode: true'
    ],
    [
      'file-storage',
      'storage',
      's3://user-avatars.company.com',
      'Almacenamiento de archivos de perfil de usuario',
      'region: us-east-1; encryption: AES256'
    ]
  ];
  
  // Crear workbook
  const wb = XLSX.utils.book_new();
  
  // Crear hojas
  const serviceWs = XLSX.utils.aoa_to_sheet(serviceData);
  const endpointsWs = XLSX.utils.aoa_to_sheet(endpointsData);
  const integrationsWs = XLSX.utils.aoa_to_sheet(integrationsData);
  
  // Agregar hojas al workbook
  XLSX.utils.book_append_sheet(wb, serviceWs, 'Servicio');
  XLSX.utils.book_append_sheet(wb, endpointsWs, 'Endpoints');
  XLSX.utils.book_append_sheet(wb, integrationsWs, 'Integraciones');
  
  // Guardar archivo
  const filePath = 'input-specifications/user-management-service-spec.xlsx';
  XLSX.writeFile(wb, filePath);
  
  console.log(`✅ Archivo Excel creado: ${filePath}`);
  
  // Crear también un ejemplo más simple
  const simpleServiceData = [
    ['Servicio', 'Descripción', 'Versión', 'Puerto', 'Equipo', 'Repositorio'],
    [
      'product-catalog-service',
      'Servicio de catálogo de productos para e-commerce',
      '1.0.0',
      3002,
      'Backend Team Beta',
      'https://github.com/company/product-catalog-service'
    ]
  ];
  
  const simpleEndpointsData = [
    ['Método', 'Ruta', 'Descripción', 'Parámetros', 'Respuesta'],
    ['GET', '/api/v1/products', 'Listar productos del catálogo', 'category:string;page:int', '200: Lista de productos'],
    ['GET', '/api/v1/products/{id}', 'Obtener producto por ID', 'id: string', '200: Producto encontrado'],
    ['POST', '/api/v1/products', 'Crear nuevo producto', 'body: ProductDTO', '201: Producto creado'],
    ['GET', '/api/v1/health', 'Health check', '', '200: OK']
  ];
  
  const simpleIntegrationsData = [
    ['Sistema', 'Tipo', 'Conexión', 'Descripción', 'Configuración'],
    ['product-db', 'database', 'mongodb://mongo.company.local:27017/products', 'Base de datos de productos', 'pool-size: 10'],
    ['inventory-api', 'rest-api', 'https://inventory.company.local/v1', 'API de inventario', 'timeout: 2000ms']
  ];
  
  const simpleWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(simpleWb, XLSX.utils.aoa_to_sheet(simpleServiceData), 'Servicio');
  XLSX.utils.book_append_sheet(simpleWb, XLSX.utils.aoa_to_sheet(simpleEndpointsData), 'Endpoints');
  XLSX.utils.book_append_sheet(simpleWb, XLSX.utils.aoa_to_sheet(simpleIntegrationsData), 'Integraciones');
  
  const simpleFilePath = 'input-specifications/product-catalog-service-spec.xlsx';
  XLSX.writeFile(simpleWb, simpleFilePath);
  
  console.log(`✅ Archivo Excel simple creado: ${simpleFilePath}`);
  
  console.log('\n📋 Archivos Excel de ejemplo creados exitosamente!');
  console.log('🔄 Ahora puedes usar el MCP para procesarlos.');
}

createExampleExcel().catch(console.error);
