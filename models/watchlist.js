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
        default: "",
        maxlength: [3000, "watched movies description cannot exceed 3000 characters"]
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("Watchlist", watchlistSchema, "watchlists")