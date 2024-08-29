const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let req;

suite('Functional Tests', function() {

    suiteSetup(() => {
        req = chai.request(server).keepOpen();
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
});
