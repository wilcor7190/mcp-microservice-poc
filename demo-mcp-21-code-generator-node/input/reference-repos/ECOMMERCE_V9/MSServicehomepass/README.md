<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# **MSServiceHomepass**

## **Descripción**
Microservicio desarrollo en nodeJs con el framework NestJs y base de datos MongoDB, con el fin de que un usuario pueda realizar las siguientes operaciones y consultar la información respectiva a la dirección : 

•	Validar la cobertura de red de la dirección de un cliente.
•	Estandarizar la dirección del cliente en la tienda virtual.
•	Gestionar los estados de las solicitudes Homepass con estado pendientes, en proceso y terminadas.


## **Pre-requisitos**
Para clonar y ejecutar esta aplicación, necesitará [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (que viene con npm) y [MongoDB](https://www.mongodb.com/try/download/community) instalados en su computadora. 


Desde su línea de comando:

```bash
# Clonar repositorio
$ git clone https://dev.azure.com/OrgClaroColombia/ECOMMERCE_V9/_git/MSServicehomepass


# Entrar al repositorio local
$ cd MSServicehomepass

# Instalar dependencias. En caso de general error usar el comando "npm i --force" o "npm i --legacy-peer-deps"
$ npm i
```

**NOTA: Antes de correr el proyecto se debe tenee en cuenta crear las colecciones de los mensajes y parametros generales en la BD local con los datos correspondientes que se van usar en el proyecto.**

Para la colección **coll_message** cargar los documentos del siguiente [Enlace](https://claromovilco.sharepoint.com/:u:/s/ImplementacinV9/ES-_ZcJRPY9ImWzWaO58-_UB0DeX5xFZ0I7rvyrgFIzw3g?e=sxNOT5)

Para la colección **coll_params** cargar los documentos del siguiente [Enlace](https://claromovilco.sharepoint.com/:u:/s/ImplementacinV9/EXM9L5ovb-FIuJ3MZ5cEvZEBaorSu995loQpKcVi05A4Og?e=RnMDFq)

```bash
# Correr aplicación en modo desarrollo
$ npm run start:dev
```

Luego podrá acceder desde el [navegador](http://localhost:8080) para validar que se visualize correctamente el swagger del proyecto.

## **Ejecutar pruebas unitarias y sonarQube**

Desde su línea de comando:

```bash
# Entrar al repositorio local
$ cd MSServicehomepass

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
| General               | Carlos Cuero       | cueroc@globalhitss.com         |
| General               | Juan Romero        | jr.esteban@tcs.com             |
