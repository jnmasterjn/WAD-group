//to store the movie title, the genre, the status, which user's watchlist the movie belongs to

const mongoose = require("mongoose")

// Create a new 'movie' schema
const movieSchema = new mongoose.Schema({
    movieId: {
        type: Number,
        required: [true, 'A movie must have an ID']
    },
    title: {
        type: String,
        required: [true, 'A movie must have a title']
    },
    genre: {
        type: String,
        required: [true, 'A movie must need a genre']
    },
    releaseYear: {
        type: Number,
        required: [true, 'A movie must have a release year']
    },
    rating: {
        type: Number,
        default: 0.0
    },
    price: {
        type: Number,
        required: [true, 'A movie must have a price']
    }
})

module.exports = mongoose.model("Movie", movieSchema)