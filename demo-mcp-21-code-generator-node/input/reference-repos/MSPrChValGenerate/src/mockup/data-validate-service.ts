/**
 * Clase para los response del swagger
 * @author Oscar Robayo
 */

export const dataFailed = {
    "process": "88c651c0-f3fc-11ed-9f6b-7d39327bd35e",
    "success": false,
    "status": 404,
    "documents": "Cannot GET /V1/AsycloadManuals",
    "message": "¡Ups¡, parece que algo salió mal, inténtalo nuevamente.",
    "requestTime": "2023-05-16T10:15:47-05:00",
    "method": "GET",
    "origen": "/MSAbCaAlarDisponibility/V1/AsycloadManuals"
}

export const dataSuccess = {
    "process": "9d885860-f3fc-11ed-9f6b-7d39327bd35e",
    "success": true,
    "status": 200,
    "documents": {},
    "message": "La Carga ha iniciado",
    "requestTime": "2023-05-16T10:16:21-05:00",
    "responseTime": 4,
    "method": "GET",
    "origen": "/MSAbCaAlarDisponibility/V1/AsynloadManual"
}

export const dataSuccessFindDisponibility = {
    "success": true,
    "origen": "/MSAbCaAlarDisponibility/V1/loadManual",
    "status": 200,
    "message": "Execution successful",
    "documents": {
        "items": [
            {
                "_id": "6463d8a68b04c66094bedef0",
                "parentPartNumber": "PO_Equ70013959",
                "partNumber": [
                    {
                        "sku": "70013959",
                        "description": "OT-7055 HERO 2C ALCATEL GRIS"
                    },
                    {
                        "sku": "70013945",
                        "description": "OT-7055 HERO 2C ALCATEL GRIS"
                    },
                    {
                        "sku": "70013943",
                        "description": "OT-7055 HERO 2C ALCATEL GRIS"
                    },
                    {
                        "sku": null,
                        "description": "OT-7055 HERO 2C ALCATEL GRIS"
                    }
                ],
                "stockDisponibility": 1
            }
        ]
    },
    "requestTime": "2023-05-16T14:30:13-05:00",
    "responseTime": 14,
    "method": "GET"
}

export const dataFailedFindDisponibility = {
    "process": "21bdc890-f420-11ed-a8a3-45b56310ecca",
    "success": false,
    "status": 400,
    "documents": [
        "property parentPartsNumber should not exist"
    ],
    "message": "¡Ups¡, parece que algo salió mal, inténtalo nuevamente.",
    "requestTime": "2023-05-16T14:30:36-05:00",
    "method": "GET",
    "origen": "/MSAbCaAlarDisponibility/V1/loadManual"
}