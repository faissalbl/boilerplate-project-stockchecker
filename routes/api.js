'use strict';

const { getStock } = require('../services/StockService');

module.exports = function (app) {

  function getIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }

  app.route('/api/stock-prices')
    .get(async function (req, res) {     
      const pStock = req.query.stock;
      const pLike = req.query.like || "";
      const ip = getIp(req);
      const stockData = await getStock(pStock, "true" === pLike.toLowerCase(), ip);
      console.log(pStock, pLike, stockData);
      res.json({ stockData });
    });
    
};
