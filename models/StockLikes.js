const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: String,
    likes: {
        type: Number,
        default: 0
    }
});

const StockLikes = mongoose.model('StockLikes', schema);

module.exports = StockLikes;