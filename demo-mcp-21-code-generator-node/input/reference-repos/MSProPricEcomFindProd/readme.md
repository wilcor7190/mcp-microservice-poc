<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# **MSProPricEcomFindProd**

## **Descripción**
El Microservicio de Descuento está diseñado para gestionar y aplicar descuentos de manera eficiente en el proceso de ventas de productos y aprovisionamiento de servicios desde nuestra Tienda Virtual.

## **Pre-requisitos**
Para clonar y ejecutar esta aplicación, necesitará [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (que viene con npm) y [MongoDB](https://www.mongodb.com/try/download/community) instalados en su computadora. 


Desde su línea de comando:

```bash
# Clonar repositorio
$ git clone https://alminspiraclaro.visualstudio.com/Proyecto_EcommerceV9/_git/MSProPricEcomFindProd

# Entrar al repositorio local
$ cd MSProPricEcomFindProd

# Instalar dependencias. En caso de general error usar el comando "npm i --force" o "npm i --legacy-peer-deps"
$ npm i
```

**NOTA: Antes de correr el proyecto se debe tenee en cuenta crear las colecciones de los mensajes y parametros generales en la BD local con los datos correspondientes que se van usar en el proyecto.**

Para la colección **coll_message** cargar los documentos del siguiente [Enlace](https://claromovilco.sharepoint.com/:u:/s/ImplementacinV9/EZGV2cnwg85Di-3mf7iO78MBfBvctNRfXPkAMQOPazorew?e=a0JuyY)

Para la colección **coll_params** cargar los documentos del siguiente [Enlace](https://claromovilco.sharepoint.com/:u:/s/ImplementacinV9/EUac8x8psepLqyAXguUWzRwBMFcsu5puHBe8DGiM6PfKWw?e=Deqsds)

```bash
# Correr aplicación en modo desarrollo
$ npm run start:dev
```

Luego podrá acceder desde el [navegador](http://localhost:8080) para validar que se visualize correctamente el swagger del proyecto.

## **Ejecutar pruebas unitarias y sonarQube**

Desde su línea de comando:

```bash
# Entrar al repositorio local
$ cd MSProPricEcomFindProd

# Comando generación pruebas unitarias
$ npm run test:cov 

# Generación informe herramienta sonarQube
$ npm run sonar-scanner
```
Una vez finalizado el proceso y si no genero ningún error Luego podrá acceder desde el [navegador](http://sonarqube-pruebad.apps.claro.co/projects?sort=name) para validar que se visualize correctamente el informe de sonarQUbe.

# Trazabilidad

Este microservicio opera con trazabilidad emitida a través de eventos de Kafka, por lo cual, si se requiere emular en un ambiente local, será necesario crear localmente un entorno de Kafka. Para ello, sigue los siguientes pasos:

* En el template de NestJS  ([MSTemplateNestJs](https://OrgClaroColombia@dev.azure.com/OrgClaroColombia/ECOMMERCE_V9/_git/MSTemplateNestJs)) en la rama `feature/trazabilidad-kafka` (Por cofirmar), encontrarás un archivo llamado docker-compose.yml. Cópialo y pégalo en la raíz de este proyecto.

* En la terminal de comandos, ejecuta la instrucción `docker-compose up -d`. Esto levantará dos imágenes de Docker: *Zookeeper*, herramienta administrativa para la gestión del cluster de Kafka y *kafka-broker-1*, el broker de kafka.

*  En una terminal de Git Bash ejecutamos las siguientes instrucciones:

```bash
# Nos conectamos al broker
winpty docker exec -it kafka-broker-1 bash

# Creamos el tópico del trace
$ kafka-topics --bootstrap-server kafka-broker-1:9092 --create --topic TraceDataTopic

> Nota: Para poder desplegar este ambiente es necesario que en tu maquina se encuentre previamente instalado y configurado Docker Desktop y la terminal Git Bash.

> Nota: En caso de no desplegar localmente Kafka, la emisión del evento de traza fallara y creará un registro en la colección *coll_service_error* por cada punto de emisión de trazabilidad.

## **Escuchar mensajes de un Topic**

Usando Git Bash, ejecuta los siguientes comandos:

```bash
# Conexión al broker de kafka
$ winpty docker exec -it kafka-broker-1 bash

# Escuchar mensajes
$ kafka-console-consumer --bootstrap-server kafka-broker-1:9092 --topic TraceDataTopic

# Utilizando la flag -from-beginning podemos escuchar mensajes pero al momento de conectarse se escucharan todos los mensajes ya enviados 
$ kafka-console-consumer --bootstrap-server kafka-broker-1:9092 --topic TraceDataTopic -from-beginning
```

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


| Operación             | Autor                   | Correo                               |
| --------------------- | ----------------------- | ------------------------------------ |
| General               | Hamilton Acevedo        | hamilton.acevedo@vasscompany.com     |
| General               | Alexis Agustin Sterzer  | alexissterzer@sqdm.com               |
| General               | Diego Linares Villegas  | linaresd@globalhitss.com             |

