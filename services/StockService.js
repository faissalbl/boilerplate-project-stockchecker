const urlTemplate = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote"
const urlTemplateSpaceholder = "[symbol]";

module.exports.getStock = async function(pStock) {
    if (!pStock) throw new Error("stock is empty");
    const url = urlTemplate.replace(urlTemplateSpaceholder, pStock);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed with status: ${res.status}`);
    const { symbol: stock, latestPrice: price } = await res.json();
    return { stock, price };
}