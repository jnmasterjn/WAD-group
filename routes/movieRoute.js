// handles movie browsing
    // - used for pages
    // - movies
    // - movies/:id

const express = require("express");
const router = express.Router();
const fs = require("fs");
const isLoggedIn = require("../middleware/auth");
const movieController = require("../controllers/movie-controllers")

router.get("/movie", isLoggedIn, movieController.displayMovies);

router.get("/movie/:id", isLoggedIn, movieController.movieDesc);

module.exports = router;