// handles movie browsing
    // - used for pages
    // - movies
    // - movies/:id

const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const User = require("../models/user");
const fs = require("fs");
const isLoggedIn = require("../middleware/auth");

router.get("/movie", isLoggedIn, async (req, res) => {
    const movies = await Movie.find()
    res.render("movies/movieList", {movies})
})

router.get("/movie/:id", isLoggedIn, async (req, res) => {

    //req.params = values from the URL
    const ind_movie = await Movie.findById(req.params.id);
    const user = await User.findById(req.session.userId);

    //some --> check if ANY item matches
    //toString() --> mongo object is different from string
    const isInWatchlist = user.watchlist.some(id =>
        id.toString() === ind_movie._id.toString()
    );

    res.render("movies/movieDetail", {ind_movie, isInWatchlist})
})

module.exports = router;