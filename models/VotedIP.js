const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: String,
    likedStocks: [String]
});

const IPLiked = mongoose.model('VotedIP', schema);

module.exports = IPLiked;