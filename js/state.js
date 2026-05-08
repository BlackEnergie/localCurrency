/* ============================================================
   LocalCurrency — État partagé de l'application
   Importable par tous les modules ; les mutations de propriétés
   sont visibles par tous les importateurs (singleton ES module).
   ============================================================ */

export const state = {
  rates:      null,   // { USD: 1, EUR: 0.92, ... }
  base:       'USD',  // devise de base retournée par l'API
  lastUpdate: null,   // Date object
  isLoading:  false,
  favorites:  [],     // [{ from: 'USD', to: 'EUR' }, ...]
};
