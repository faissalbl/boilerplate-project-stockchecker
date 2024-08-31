const VotedIP = require('../models/VotedIP');
const StockLikes = require('../models/StockLikes');

const urlTemplate = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote"
const urlTemplateSpaceholder = "[symbol]";

module.exports.getStock = async function(pStock, pLike, ip) {
    if (!pStock || Array.isArray(pStock) && pStock.length === 0) 
        throw new Error("stock is empty");
    
    if (!Array.isArray(pStock)) pStock = [ pStock ];
    
    let result = pStock.map(async s => {
        const url = urlTemplate.replace(urlTemplateSpaceholder, s);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed with status: ${res.status}`);
        
        const { symbol: stock, latestPrice: price } = await res.json();

        let likes = await getStockLikes(stock);
        const votedIP = await getVotedIP(ip);
        const likedStocks = (votedIP || {}).likedStocks || [];
        if (pLike && !likedStocks.includes(stock)) {
            likes++;
            await updateStockLikes(stock, likes);
            await updateVotedIP(ip, stock);
        }

        return { stock, price, likes };
    });

    result = await Promise.all(result);

    // if it is an array of a single object, use the single object instead of the array
    if (result.length === 1) result = result[0]
    else result = calculateRelLikes(result);

    return result;
}

function calculateRelLikes(stocks) {
    if (stocks.length != 2) throw new Error("It is only possible to calculate rel_likes for two stocks");
    const result = [
        {
            stock: stocks[0].stock,
            price: stocks[0].price,
            rel_likes: stocks[0].likes - stocks[1].likes
        },
        {
            stock: stocks[1].stock,
            price: stocks[1].price,
            rel_likes: stocks[1].likes - stocks[0].likes
        }
    ];
    return result;
}

async function getStockLikes(stock) {
    const stockLikes = await StockLikes.findById(stock);
    const likes = stockLikes ? stockLikes.likes : 0;
    return likes;
}

async function updateStockLikes(stock, likes) {
    await StockLikes.findByIdAndUpdate(stock, { likes }, { new: true, upsert: true, useFindAndModify: false });
}

async function updateVotedIP(ip, stock) {
    await VotedIP.findByIdAndUpdate(ip, { $push: { likedStocks: stock } }, { new: true, upsert: true, useFindAndModify: false });
}

async function getVotedIP(ip) {
    const votedIP = await VotedIP.findById(ip);
    return votedIP;
}