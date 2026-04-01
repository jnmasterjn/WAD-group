// Without this file mongoDB wouldn't know the structure of the movie data

//to store the movie ID, title, the genre, year released, rating, and whether the movie has been watched or not

const mongoose = require("mongoose")

// Create a new 'movie' schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A movie must have a title'],
        unique:true,
        maxlength: [50, "A movie title cannot exceed 50 characters"]
    },
    description:{
        type: String,
        default: "",
        required: [true, 'A movie must have a description'],
        maxlength: [3000, "A movie description cannot exceed 3000 characters"]
    },
    genre: {
        type: String,
        required: [true, 'A movie must need a genre'],
        maxlength: [20, "A movie genre cannot exceed 20 characters"]
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