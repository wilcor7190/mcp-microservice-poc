# mscusbillperiodquerym-service

MicroServicio

## Description

Microservicio para MSCusBillPeriodQueryM

## Installation

```bash
$ npm install
```

## Configuration

Copy the environment file and configure your variables:

```bash
$ cp .env.example .env
```

Required environment variables:
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SERVICE_NAME`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- `DB-PASSWORD`
- `JWT-SECRET`
- `API-KEY`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints


### GET /MS/CUS/CustomerBill/MSCusBillPeriodQueryM/v1.0/QueryCicleChangeStatusCusBil

Operación para administrar las solicitudes de registro de programación, cancelación y consulta de cambio de ciclo para clientes pospago móvil

**Parameters:**
- `min` (Number, optional): Número del min del cliente
- `custCode` (String, optional): Código del cliente
- `coId` (Number, optional): Contrato del cliente

**Responses:**
- 200: Operación exitosa
- 400: Error en la validación de datos
- 404: Recurso no encontrado
- 500: Error interno del servidor


## Database

This microservice uses ORACLE as the database.

## Integrations


### prc_consultarestadocc_app

Procedimiento para consultar el estado de solicitudes de cambio de ciclo

**Type:** Base de datos
**Connection:** BSCSQA = (DESCRIPTION = (ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 132.147.170.98)(PORT = 1750)))(CONNECT_DATA = (SERVICE_NAME = BSCSQA)))


## Team

**Team:** Backend Team
**Version:** 1.0.0
**Repository:** https://github.com/company/mscusbillperiodquerym-service

## License

Private - Backend Team
