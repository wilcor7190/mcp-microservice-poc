export const responseConsumeInventoryManageSucces = {
    executed: true,
    status: 200,
    data: {
      materialHijo: "70049306",
      materialPadre: "70049324",
      materialPadreDescription: "OPP A57 128GB NG",
      articleGroup: "TV0003",
      articleGroupDescription: "TERMINALES",
      materialType: "TE05",
      materialTypeDescription: "Terminales mÃ³viles",
      brand: "OPPO",
      productCost: "617806",
      length: "",
      width: "",
      height: "",
      weight: "0,00",
    },
    requestInfo: {
      url: "http://msproductinventorymanage-omnprod.apps.t7bm85w2.eastus2.aroapp.io/products/getChild?sku=70049324&salesType=PRE",
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        requestStartedAt: "1718859400534",
        "User-Agent": "axios/1.7.2",
        "Accept-Encoding": "gzip, compress, deflate, br",
        processingTime: 696,
      },
      params: undefined,
      data: undefined,
      timeout: 15000,
      source: "/products/getChild",
    },
}

export const responseGetSKUSond = {
    "@type": "APIMProPricEcomFindProd",
    channel: {
      href: "https://broker-comercial.claro.com.co/APIM/PRT/Product/RSProductPriceValidate/V1/ProductPrice/channel/EC_B2C",
      id: "EC9_B2C",
      name: "eCommerce",
    },
    productConfiguration: {
      contextCharacteristic: {
        "@type": "ObjectCharacteristic",
        name: "OMS sku child Configuration",
        value: {
          "@type": "OMS Backend",
          childMaterial: "70049306",
          parentMaterial: "70049324",
          parentMaterialDescription: "OPP A57 128GB NG",
          articleGroup: "TV0003",
          articleGroupDescription: "TERMINALES",
          materialType: "TE05",
          materialTypeDescription: "Terminales mÃ³viles",
          brand: "OPPO",
          productCost: "617806",
          length: "",
          width: "",
          height: "",
          weight: "0,00",
        },
      },
    },
}

export const successfullResponse = {
  "@type": "APIMProPricEcomFindProd",
  "channel": {
      "href": "https://broker-comercial.claro.com.co/APIM/PRT/Product/RSProductPriceValidate/V1/ProductPrice/channel/EC_B2C",
      "id": "EC9_B2C",
      "name": "eCommerce"
  },
  "productConfiguration": {
      "contextCharacteristic": {
          "@type": "ObjectCharacteristic",
          "name": "OMS sku child Configuration",
          "value": {
              "@type": "OMS Backend",
              "childMaterial": "70049306",
              "parentMaterial": "70049324",
              "parentMaterialDescription": "OPP A57 128GB NG",
              "articleGroup": "TV0003",
              "articleGroupDescription": "TERMINALES",
              "materialType": "TE05",
              "materialTypeDescription": "Terminales mÃ³viles",
              "brand": "OPPO",
              "productCost": "0",
              "length": "",
              "width": "",
              "height": "",
              "weight": "0,00"
          }
      }
  }
}


export const badRequestResponse = {
  "status": 404,
  "reason": "Bad Request",
  "validFor": {
      "endDateTime": "2024-06-20T16:36:30.332Z",
      "startDateTime": "2024-06-20T16:36:30.332Z"
  },
  "message": "Lo sentimos, reintente nuevamente",
  "responseTime": 0,
  "referenceError": "/RSProPricEcomFindProd/V1/SKUsondd"
}

export const serveErrorResponse = {
  "status": 500,
  "reason": "Product with SKU: 700493224 not found, or doesn't have property: materialKit",
  "validFor": {
      "endDateTime": "2024-06-20T16:40:48.046Z",
      "startDateTime": "2024-06-20T16:40:48.046Z"
  },
  "message": "Lo sentimos, reintente nuevamente",
  "code": 404,
  "responseTime": 0,
  "referenceError": "/RSProPricEcomFindProd/V1/SKUsond"
}