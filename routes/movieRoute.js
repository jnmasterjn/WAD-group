// handles movie browsing
    // - used for pages
    // - movies
    // - movies/:id

const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const fs = require("fs");

router.get("/movie", async (req, res) => {
    const movies = await Movie.find()
    res.render("movies/movieList", {movies})
})

router.get("/movie/:id", async (req, res) => {
    const ind_movie = await Movie.findById(req.params.id);
    res.render("movies/movieDetail", {ind_movie})
})

module.exports = router;