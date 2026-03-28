const mongoose = require("mongoose")

//creates the schema
const watchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }],
});

module.exports = mongoose.model("Watchlist", watchlistSchema, "watchlists")