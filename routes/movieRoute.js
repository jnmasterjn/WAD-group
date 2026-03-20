// handles movie browsing
    // - used for pages
    // - movies
    // - movies/:id

const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const fs = require("fs");


router.get("/test-movies", async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

router.get("/movie", async (req, res) => {
    const movies = await Movie.find()
    res.render("movies/movieList", {movies})
})

module.exports = router;

