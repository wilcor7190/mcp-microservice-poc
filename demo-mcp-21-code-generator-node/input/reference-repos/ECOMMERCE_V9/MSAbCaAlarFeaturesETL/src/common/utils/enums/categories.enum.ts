/**
 * Enumera las categorias y familias de las caracteristicas
 * @author  Santiago Vargas
 */

export enum EFamily {
  EQUIPMENT = "Terminales",
  TECHNOLOGY = "Tecnologia",
  POSPAGO = "Pospago",
  PREPAGO = "Prepago",
  HOME = "Hogares"
}

export enum ETypeParams {
  PRICES = 'productOfferingPrices',
  FEATURES = 'characteristics'
}

export const filterCategorieType = "characteristics";
export const filterPricesType = "productOfferingPrices";