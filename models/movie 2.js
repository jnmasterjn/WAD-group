// Without this file mongoDB wouldn't know the structure of the movie data

//to store the movie ID, title, the genre, year released, rating, and whether the movie has been watched or not

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
    isWatched: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Movie", movieSchema)