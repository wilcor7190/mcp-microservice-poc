/**
 * Clase donde se definen las respuestas del swagger
 * @author Oscar Robayo
 */
export const dataFailed ={
    "process": "de8a4fd0-f36b-11ed-9914-0fd032f81812",
    "success": false,
    "status": 404,
    "documents": "Cannot POST /V1/manuall",
    "message": "¡Ups¡, parece que algo salió mal, inténtalo nuevamente.",
    "requestTime": "2023-05-15T22:00:13+00:00",
    "method": "POST",
    "origen": "/MSAbCaAlarPricesETL/V1/manuall"
}

export const dataSuccess = {
    "process": "5b43a210-f36c-11ed-9914-0fd032f81812",
    "success": true,
    "status": 200,
    "message": "La carga inició",
    "requestTime": "2023-05-15T22:03:43+00:00",
    "responseTime": 8,
    "method": "POST",
    "origen": "/MSAbCaAlarPricesETL/V1/manual"
}

export const LastPricesDummy = {
    "CatentryPartNumber": "PO_Equ70048210",
    "extendedSitesCatalogAssetStore": "0",
    "extendedSitesCatalogAssetStoreList": "510900",
    "family": 'KitPrepago'
}

export const saveDataCollectionDummy = {
    "_id": "648b6f4139bf5342b0f19a36",
    "PriceListUniqueId": "",
    "PriceListName": "Extended Sites Catalog Asset StoreList",
    "CatentryUniqueId": "",
    "CatentryPartNumber": "PO_Equ70048210",
    "Identifier": "",
    "Precedence": "",
    "StartDate": "",
    "EndDate": "",
    "LastUpdate": "",
    "QuantityUnitIdentifier": "",
    "MinimumQuantity": "",
    "Description": "",
    "PriceInCOP": "510900",
    "PriceInCOPTax": "",
    "PlazosSinImpuestos": "",
    "PlazosConImpuestos": "",
    "Field1": "",
    "Field2": "",
    "Delete": ""
  }