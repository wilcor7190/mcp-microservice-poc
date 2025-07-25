export const responseDummy = {
  success: true,
  message: 'Execution successfully',
  origen: 'RSGeographicLocationNameCities/V1/warehouses',
  status: 200,
  documents: [
    {
      procSales: 'TER',
      typeProduct: 'Claro',
      coverageId: 'CORBETA015',
      typePlan: 'POS',
      typeSales: 'ACT',
      products: [
        {
          partNumber: '7017324',
          quantity: 1,
          avaliability: [
            {
              codWareHouse: 'H006',
              codCenter: 'C230',
            },
          ],
        },
        {
          partNumber: '70024050',
          quantity: 1,
          avaliability: [
            {
              codWareHouse: 'H001',
              codCenter: 'C230',
            },
          ],
        },
      ],
    },
  ],
};
