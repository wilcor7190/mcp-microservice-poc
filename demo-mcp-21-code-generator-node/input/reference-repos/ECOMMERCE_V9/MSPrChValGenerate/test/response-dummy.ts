export const responseDummy = {
  "process": "e5cca750-f9a8-11ed-a899-25a9d5ddf376",
  "success": true,
  "status": 200,
  "message": "Inicia el proceso de actualización",
  "requestTime": "2023-05-23T15:32:12-05:00",
  "responseTime": 100,
  "method": "POST",
  "origen": "/RSAbsoluteCalendarAlarmFeaturesETL/V1/Categories/manual"
}

export const mockData = [
  {
    "features" : [
      {
        "id" : "specificationSubtype",
        "name" : "specificationSubtype",
        "value" : "Telefono"
      },
      {
        "id" : "MEMORIA_INTERNA",
        "name" : "MEMORIA INTERNA",
        "value" : "NA"
      },
      {
        "id" : "MEMORIA_RAM",
        "name" : "MEMORIA RAM",
        "value" : "NA"
      },
      {
        "id" : "NOMBRE_COMERCIAL",
        "name" : "NOMBRE COMERCIAL",
        "value" : "NA"
      },
      {
        "id" : "CLASIFICACION",
        "name" : "CLASIFICACION",
        "value" : null
      },
      {
        "id" : "OBSEQUIO",
        "name" : "OBSEQUIO",
        "value" : "NA"
      }
    ],
    "id" : "PO_Equ70048459",
    "partNumber" : "PO_Equ70048459",
    "name" : null,
    "description" : "SIRIUM JM VL03 NA",
    "fullImage" : "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/646x1000/70048459.jpg",
    "thumbnail" : "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/200x310/na-na-na.jpg",
}]

export const contingencyDummy = [{
  "params" : {
		"family" : "Terminales",
		"type" : "characteristics",
		"Page" : 131
	},
	"data" : {
		"getProductOfferingResponse" : [
			{
				"_id" : "6466b0a4a840e8cec4164b3a",
				"id" : "PO_Equ70053420",
				"versions" : [
					{
						"id" : "PO_Equ70053420",
						"name" : "VI V25 PRO 256GB AZ AUDTWS2E+BAND KITCON",
						"description" : "",
						"specificationType" : "ProductOffering",
						"characteristics" : [
							{
								"id" : "BATERIA",
								"versions" : [
									{
										"value" : "NA",
										"name" : "BATERIA"
									}
								]
							},
							{
								"id" : "CANTIDAD_DE_NUCLEOS_TOTAL",
								"versions" : [
									{
										"value" : "NA",
										"name" : "CANTIDAD DE NUCLEOS TOTAL"
									}
								]
							}
						],
						"specificationSubtype" : "Telefono"
					}
				]
			}
		]
	}
}]