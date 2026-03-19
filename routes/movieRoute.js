// handles movie browsing
    // - used for pages
    // - movies
    // - movies/:id


const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");



router.get("/movie", (req, res) => {
    res.render("movies/movieList")
})


module.exports = router;