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

router.get("/movie/:id", isLoggedIn, async (req, res) => {

    //req.params = values from the URL
    const ind_movie = await Movie.findById(req.params.id);
    const user = await User.findById(req.session.userId);

    
    //Recently view

    if (!req.session.recentlyViewed) {
        req.session.recentlyViewed = [];
    }

    const currentMovieId = ind_movie._id.toString();

    // remove duplicate
    const updatedList = req.session.recentlyViewed.filter(function(id) {
        return id.toString() !== currentMovieId;
    });

    req.session.recentlyViewed = updatedList;

    // add to front
    req.session.recentlyViewed.unshift(currentMovieId);

    // limit 5
    req.session.recentlyViewed = req.session.recentlyViewed.slice(0, 5);

    //some --> check if ANY item matches
    //toString() --> mongo object is different from string
    const isInWatchlist = user.watchlist.some(id =>
        id.toString() === ind_movie._id.toString()
    );

    res.render("movies/movieDetail", {ind_movie, isInWatchlist})
    console.log(req.session.recentlyViewed);
})
module.exports = router;