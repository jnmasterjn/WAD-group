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
    watchlistDesc: {
        type: String,
        default: ""
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Watchlist", watchlistSchema, "watchlists")