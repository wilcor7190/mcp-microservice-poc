<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# **MSAbCaAlarPricesETL**

## Description
Microservicio desarrollo en nodeJs con el framework NestJs y base de datos MongoDB, con el fin de desarrollar las diferentes operaciones para conocer los precios de los productos para mostrar a los clientes en Ecommerce V9.

## **Pre-requisitos**
Para clonar y ejecutar esta aplicación, necesitará [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (que viene con npm) y [MongoDB](https://www.mongodb.com/try/download/community) instalados en su computadora.

Desde su línea de comando:

```bash
# Clonar repositorio
$ git clone https://alminspiraclaro.visualstudio.com/Proyecto_EcommerceV9/_git/MSAbCaAlarPricesETL

# Entrar al repositorio local
$ cd MSAbCaAlarPricesETL

# Instalar dependencias. En caso de general error usar el comando "npm i --force" o "npm i --legacy-peer-deps"
$ npm i
```

**NOTA: Antes de correr el proyecto se debe tenee en cuenta crear las colecciones de los mensajes y parametros generales en la BD local con los datos correspondientes que se van usar en el proyecto.**

Para la colección **coll_message** cargar los documentos del siguiente [Enlace](https://claromovilco.sharepoint.com/:f:/s/ImplementacinV9/EoY827Vvaw9OrrB-5hqg358BH3bwkQGOOue0kAKN0QSvxg?e=duEdSV)

Para la colección **coll_params** cargar los documentos del siguiente [Enlace](https://claromovilco.sharepoint.com/:f:/s/ImplementacinV9/EoY827Vvaw9OrrB-5hqg358BH3bwkQGOOue0kAKN0QSvxg?e=duEdSV)

```bash
# Correr aplicación en modo desarrollo
$ npm run start:dev
```

Luego podrá acceder desde el [navegador](http://localhost:8080) para validar que se visualize correctamente el swagger del proyecto.

## **Ejecutar pruebas unitarias y sonarQube**

Desde su línea de comando:

```bash
# Entrar al repositorio local
$ cd MSAbCaAlarPricesETL

# Comando generación pruebas unitarias
$ npm run test:cov 

# Generación informe herramienta sonarQube
$ npm run sonar-scanner
```
Una vez finalizado el proceso y si no genero ningún error Luego podrá acceder desde el [navegador](http://sonarqube-pruebad.apps.claro.co/projects?sort=name) para validar que se visualize correctamente el informe de sonarQUbe.

## **Módulos del proyecto**

- Common:
  Módulo transversal en el cual se define la configuración, librerías, enumeradores, útilidades.

- Controller:
  Modulo en el cual se definen los paths o funcionalidades que expone el servicio

- Core:
  Módulo en el cual se implementa la lógica de negocio (use cases)

- Data Provider:
  Módulo que controla la conexión a legados, base de datos y servicios con los cuales se tiene comunicación

## **Autores**
Los diferentes autores y encargados de cada operación de la aplicación para inquietudes son:


| Operación             | Autor              | Correo                         |
| --------------------- | ------------------ | ------------------------------ |
| General               | Betzy Montañez     | montanezba@globalhitss.com     |
| General               | Oscar Robayo       | robayooa@globalhitss.com       |
