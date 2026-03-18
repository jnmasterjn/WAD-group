//to store the movie title, the genre, the status, which user's watchlist the movie belongs to

const mongoose = require("mongoose")

// Create a new 'movie' schema
const movieSchema = new mongoose.Schema({
    title: String,
    genre: String,
    releaseYear: Number,
    status: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Movie", movieSchema)