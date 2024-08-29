const VotedIP = require('../models/VotedIP');
const StockLikes = require('../models/StockLikes');

const urlTemplate = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote"
const urlTemplateSpaceholder = "[symbol]";

module.exports.getStock = async function(pStock, pLike, ip) {
    if (!pStock) throw new Error("stock is empty");
    const url = urlTemplate.replace(urlTemplateSpaceholder, pStock);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed with status: ${res.status}`);
    const { symbol: stock, latestPrice: price } = await res.json();

    let likes = await getStockLikes(stock);
    let votedIP = await getVotedIP(ip);
    if (pLike && !votedIP) {
        likes++;
        await updateStockLikes(stock, likes);
        console.log("findByIdAndUpdate passed");
        const votedIP = new VotedIP({ _id: ip });
        await votedIP.save();
    }

    return { stock, price, likes };
}

async function getStockLikes(stock) {
    const stockLikes = await StockLikes.findById(stock);
    console.log("stockLikes: ", stockLikes);
    const likes = stockLikes ? stockLikes.likes : 0;
    return likes;
}

async function updateStockLikes(stock, likes) {
    await StockLikes.findByIdAndUpdate(stock, { likes }, { new: true, upsert: true, useFindAndModify: false });
}

async function getVotedIP(ip) {
    const votedIP = await VotedIP.findById(ip);
    return votedIP;
}