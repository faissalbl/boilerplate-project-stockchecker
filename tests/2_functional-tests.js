const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const VotedIP = require('../models/VotedIP');
const StockLikes = require('../models/StockLikes');

chai.use(chaiHttp);

let req;

suite('Functional Tests', function() {

    suiteSetup(async () => {
        console.log('creating chai request');
        req = chai.request(server).keepOpen();
        await VotedIP.deleteMany();
        await StockLikes.deleteMany();
    });

    test('Viewing one stock: GET request to /api/stock-prices/', async () => {
        const res = await req.get('/api/stock-prices?stock=GOOG')
        const { stockData } = res.body;
        assert.isDefined(stockData);

        const { stock, price, likes } = stockData;
        assert.equal(stock, 'GOOG');
        assert.isNumber(price);
        assert.isNumber(likes);
    });

    test('Viewing one stock and liking it: GET request to /api/stock-prices/', async () => {
        const res = await req.get('/api/stock-prices?stock=GOOG&like=true')
        const { stockData } = res.body;
        assert.isDefined(stockData);

        const { stock, price, likes } = stockData;
        assert.equal(stock, 'GOOG');
        assert.isNumber(price);
        assert.isNumber(likes);
        assert.isTrue(likes >= 1)
    });

    suiteTeardown(() => {
        console.log("closing the chai request");
        req.close();
    });
});
