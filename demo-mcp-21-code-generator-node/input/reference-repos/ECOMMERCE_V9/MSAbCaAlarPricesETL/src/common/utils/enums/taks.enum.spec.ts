import { Etask, ETaskDesc, ETaskPrices } from './taks.enum';

describe('Etask should have correct values', () => {
  it('CREATE should be "CREATE" ', () => {
    expect(Etask.CREATE).toBe('PROCESS_CREATE');
  });

  it('FINDALL should be --> "FINDALL"', () => {
    expect(Etask.FINDALL).toBe('CONSULTANDO_MOCKUPS');
  });

  it('FINDONE should be --> "FINDONE"', () => {
    expect(Etask.FINDONE).toBe('CONSULTANDO_MOCKUP');
  });

  it('UPDATE should be --> "UPDATE"', () => {
    expect(Etask.UPDATE).toBe('ACTUALIZANDO_MOCKUP');
  });

  it('REMOVE should be --> "REMOVE"', () => {
    expect(Etask.REMOVE).toBe('ELIMINANDO_MOCKUP');
  });

  it('LOAD_MESSAGE should be --> "LOAD_MESSAGE"', () => {
    expect(Etask.LOAD_MESSAGE).toBe('CARGANDO_MENSAJES');
  });

  it('LOAD_PARAM should be --> "LOAD_PARAM"', () => {
    expect(Etask.LOAD_PARAM).toBe('CARGANDO_PARAMETROS');
  });

  it('ERROR_LOAD_PARAM should be --> "ERROR_LOAD_PARAM"', () => {
    expect(Etask.ERROR_LOAD_PARAM).toBe('ERROR_CARGANDO_PARAMETROS');
  });

  it('CHANNEL should be --> "CHANNEL"', () => {
    expect(Etask.CHANNEL).toBe('VALIDATE_CHANNEL');
  });

  it('CONSUMED_SERVICE should be --> "CONSUMED_SERVICE"', () => {
    expect(Etask.CONSUMED_SERVICE).toBe('CONSUMED_SERVICE');
  });

  it('PROCESS_KAFKA_ACCEPT_RETRY_TOPIC should be --> "PROCESS_KAFKA_ACCEPT_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_ACCEPT_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_ACCEPT_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_START_ORDER_RETRY_TOPIC should be --> "PROCESS_KAFKA_START_ORDER_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_START_ORDER_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_START_ORDER_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_RESERVE_NUMBER_RETRY_TOPIC should be --> "PROCESS_KAFKA_RESERVE_NUMBER_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_RESERVE_NUMBER_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_RESERVE_NUMBER_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_PAYMENT_CONF_RETRY_TOPIC should be --> "PROCESS_KAFKA_PAYMENT_CONF_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_PAYMENT_CONF_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_PAYMENT_CONF_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_UPDATE_BILL_MED_RETRY_TOPIC should be --> "PROCESS_KAFKA_UPDATE_BILL_MED_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_UPDATE_BILL_MED_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_UPDATE_BILL_MED_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_RESERVE_NUMBER_CONFIRM_RETRY_TOPIC should be --> "PROCESS_KAFKA_RESERVE_NUMBER_CONFIRM_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_RESERVE_NUMBER_CONFIRM_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_RESERVE_NUMBER_CONFIRM_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_CONTRACT_RETRY_TOPIC should be --> "PROCESS_KAFKA_CONTRACT_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_CONTRACT_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_CONTRACT_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_UPDATE_ITEM_RETRY_TOPIC should be --> "PROCESS_KAFKA_UPDATE_ITEM_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_UPDATE_ITEM_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_UPDATE_ITEM_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_SUBMIT_RETRY_TOPIC should be --> "PROCESS_KAFKA_SUBMIT_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_SUBMIT_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_SUBMIT_RETRY_TOPIC',
    );
  });

  it('PROCESS_KAFKA_PAYMENT_RETRY_TOPIC should be --> "PROCESS_KAFKA_PAYMENT_RETRY_TOPIC"', () => {
    expect(Etask.PROCESS_KAFKA_PAYMENT_RETRY_TOPIC).toBe(
      'PROCESS_KAFKA_PAYMENT_RETRY_TOPIC',
    );
  });

  it('EXCEPTION_MANAGER should be --> "EXCEPTION_MANAGER"', () => {
    expect(Etask.EXCEPTION_MANAGER).toBe('EXCEPTION_MANAGER');
  });

  it('VALIDATE_REQUEST should be --> "VALIDATE_REQUEST"', () => {
    expect(Etask.VALIDATE_REQUEST).toBe('VALIDATE_REQUEST');
  });

  it('HTTP_RESPONSE should be --> "HTTP_RESPONSE"', () => {
    expect(Etask.HTTP_RESPONSE).toBe('HTTP_RESPONSE');
  });

  it('EMIT_KAFKA should be --> "EMIT_KAFKA"', () => {
    expect(Etask.EMIT_KAFKA).toBe('EMITIENDO EVENTO KAFKA');
  });

  it('total eneums', () => {
    expect(Object.keys(Etask).length).toBe(34);
  });
});

describe('ETaskDesc should have correct values', () => {
  it('ERROR_SERVICE should be "ERROR_SERVICE" ', () => {
    expect(ETaskPrices.ERROR_SERVICE).toBe('Error en el services impl');
  });

  it('ERROR_DELETE_DATABASE_EQUIPMENT should be --> "ERROR_DELETE_DATABASE_EQUIPMENT"', () => {
    expect(ETaskPrices.ERROR_DELETE_DATABASE_EQUIPMENT).toBe(
      'Error al eliminar la base de datos Equipment',
    );
  });

  it('ERROR_CONSULT_COLLECTION_COLPRTPRODUCTOFFERING should be --> "ERROR_CONSULT_COLLECTION_COLPRTPRODUCTOFFERING"', () => {
    expect(ETaskPrices.ERROR_CONSULT_COLLECTION_COLPRTPRODUCTOFFERING).toBe(
      'Error al consultar la coleccion COLPRTPRODUCTOFFERING',
    );
  });

  it('ERROR_PRICE_EQUIPMENTUC should be --> "ERROR_PRICE_EQUIPMENTUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_EQUIPMENTUC).toBe(
      'Error en el metodo terminales',
    );
  });

  it('ERROR_PRICE_EQUIPMENTPROCESSUC should be --> "ERROR_PRICE_EQUIPMENTPROCESSUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_EQUIPMENTPROCESSUC).toBe(
      'Error en el metodo pricesEquipmentProcess',
    );
  });

  it('ERROR_PRICE_TECHNOLOGYUC should be --> "ERROR_PRICE_TECHNOLOGYUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_TECHNOLOGYUC).toBe(
      'Error en el metodo tecnologia',
    );
  });

  it('ERROR_PRICE_TECHNOLOGYPROCESSUC should be --> "ERROR_PRICE_TECHNOLOGYPROCESSUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_TECHNOLOGYPROCESSUC).toBe(
      'Error en el metodo pricesTechnologyProcess',
    );
  });

  it('ERROR_PRICE_POSPAGOUC should be --> "ERROR_PRICE_POSPAGOUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_POSPAGOUC).toBe(
      'Error en el metodo pospago',
    );
  });

  it('ERROR_PRICE_PREPAGOUC should be --> "ERROR_PRICE_PREPAGOUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_PREPAGOUC).toBe(
      'Error en el metodo prepago',
    );
  });

  it('ERROR_PRICE_MOBILEPROCESSUC should be --> "ERROR_PRICE_MOBILEPROCESSUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_MOBILEPROCESSUC).toBe(
      'Error en el metodo moviles',
    );
  });

  it('ERROR_PRICE_HOMEUC should be --> "ERROR_PRICE_HOMEUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_HOMEUC).toBe('Error en el metodo hogares');
  });

  it('ERROR_PRICE_HOMEPROCESSUC should be --> "ERROR_PRICE_HOMEPROCESSUC"', () => {
    expect(ETaskPrices.ERROR_PRICE_HOMEPROCESSUC).toBe(
      'Error en el metodo pricesHomeProcess',
    );
  });

  it('ERROR_CONNECTION_DATABASE should be --> "ERROR_CONNECTION_DATABASE"', () => {
    expect(ETaskPrices.ERROR_CONNECTION_DATABASE).toBe(
      'Error en la conexion con la base de datos',
    );
  });

  it('ERROR_SAVE_DATABASE should be --> "ERROR_SAVE_DATABASE"', () => {
    expect(ETaskPrices.ERROR_SAVE_DATABASE).toBe(
      'Error en el guardado de datos de Equipment',
    );
  });

  it('ERROR_GET_DATA_CATALOG should be --> "ERROR_GET_DATA_CATALOG"', () => {
    expect(ETaskPrices.ERROR_GET_DATA_CATALOG).toBe(
      'Error al obtener la data del valgenerate',
    );
  });

  it('ERROR_GET_PAGES should be --> "ERROR_GET_PAGES"', () => {
    expect(ETaskPrices.ERROR_GET_PAGES).toBe(
      'Error al obtener el numero de paginas',
    );
  });

  it('ERROR_FIND_LAST_PRICES should be --> "ERROR_FIND_LAST_PRICES"', () => {
    expect(ETaskPrices.ERROR_FIND_LAST_PRICES).toBe(
      'Error al obtener la data de base de datos "LastPrices"',
    );
  });

  it('ERROR_PROCESS_KAFKA should be --> "ERROR_PROCESS_KAFKA"', () => {
    expect(ETaskPrices.ERROR_PROCESS_KAFKA).toBe(
      'Error al emitir el evento kafka',
    );
  });

  it('total eneums', () => {
    expect(Object.keys(Etask).length).toBe(34);
  });
});

describe('ETaskDesc should have correct values', () => {
  it('CHANNEL should be "CHANNEL" ', () => {
    expect(ETaskDesc.CHANNEL).toBe('Validation of the channel');
  });

  it('ERROR_LOAD_PARAM should be --> "ERROR_LOAD_PARAM"', () => {
    expect(ETaskDesc.ERROR_LOAD_PARAM).toBe('Error cargando parametros');
  });

  it('UPDATE_PARAM should be --> "UPDATE_PARAM"', () => {
    expect(ETaskDesc.UPDATE_PARAM).toBe('Actualizando parametros');
  });

  it('ERROR_UPDATE_PARAM should be --> "ERROR_UPDATE_PARAM"', () => {
    expect(ETaskDesc.ERROR_UPDATE_PARAM).toBe('Error actualizando parametros');
  });

  it('ERROR_LOAD_MESSAGES should be --> "ERROR_LOAD_MESSAGES"', () => {
    expect(ETaskDesc.ERROR_LOAD_MESSAGES).toBe('Error cargando mensajes');
  });

  it('ERROR_UPDATE_MESSAGES should be --> "ERROR_UPDATE_MESSAGES"', () => {
    expect(ETaskDesc.ERROR_UPDATE_MESSAGES).toBe('Error actualizando mensajes');
  });

  it('CONSUMED_SERVICE should be --> "CONSUMED_SERVICE"', () => {
    expect(ETaskDesc.CONSUMED_SERVICE).toBe('Result service');
  });

  it('CONTADOR should be --> "CONTADOR"', () => {
    expect(ETaskDesc.CONTADOR).toBe('Numero de paginas');
  });

  it('FINISH_PAGE should be --> "FINISH_PAGE"', () => {
    expect(ETaskDesc.FINISH_PAGE).toBe('Finalizo en la pagina');
  });

  it('FINSH_EQUIPMENT should be --> "FINSH_EQUIPMENT"', () => {
    expect(ETaskDesc.FINSH_EQUIPMENT).toBe('Finalizo terminales');
  });

  it('FINSH_TECHNOLOGY should be --> "FINSH_TECHNOLOGY"', () => {
    expect(ETaskDesc.FINSH_TECHNOLOGY).toBe('Finalizo tecnologia');
  });

  it('FINSH_POSPAGO should be --> "FINSH_POSPAGO"', () => {
    expect(ETaskDesc.FINSH_POSPAGO).toBe('Finalizo pospago');
  });

  it('FINSH_PREPAGO should be --> "FINSH_PREPAGO"', () => {
    expect(ETaskDesc.FINSH_PREPAGO).toBe('Finalizo prepago');
  });

  it('FINSH_HOME should be --> "FINSH_HOME"', () => {
    expect(ETaskDesc.FINSH_HOME).toBe('Finalizo hogares');
  });

  it('FINSH_SERVICE_PRICE should be --> "FINSH_SERVICE_PRICE"', () => {
    expect(ETaskDesc.FINSH_SERVICE_PRICE).toBe('Finalizo servicio');
  });

  it('total eneums', () => {
    expect(Object.keys(Etask).length).toBe(34);
  });
});
