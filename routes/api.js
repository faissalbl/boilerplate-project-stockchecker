'use strict';

const { getStock } = require('../services/StockService');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      
      const pStock = req.query.stock;
      const pLike = req.query.like;

      const stockData = await getStock(pStock);
      console.log(pStock, pLike, stockData);
      res.json({ stockData });
    });
    
};
