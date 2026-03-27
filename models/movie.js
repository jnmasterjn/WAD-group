// Without this file mongoDB wouldn't know the structure of the movie data

//to store the movie ID, title, the genre, year released, rating, and whether the movie has been watched or not

const mongoose = require("mongoose")

// Create a new 'movie' schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A movie must have a title'],
        unique:true
    },
    description:{
        type: String,
        required: [true, 'A movie must have a description']
    },
    genre: {
        type: String,
        required: [true, 'A movie must need a genre']
    },
    releaseYear: {
        type: Number,
        required: [true, 'A movie must have a release year']
    },
    image: {
        type: String,
        unique:true
    },
    averageRating: {
        type: Number,
        default: 0.0
    },
    ratingsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Movie", movieSchema, "movies")