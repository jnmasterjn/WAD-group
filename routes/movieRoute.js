const express = require("express");
const router = express.Router();
const fs = require("fs");
const { isLoggedIn, isAdmin } = require("../middleware/auth");
const movieController = require("../controllers/movie-controllers")

router.get("/movie", movieController.displayMovies);

// show add movie form (needs to be above because :id is a catch-all parameter, it will match anything after /movie/ and store it in req.params.id. So instead of opening your add-movie page, it may try to find a movie whose id is "add".) 
router.get("/movie/add", isLoggedIn, isAdmin, (req, res) => {
    res.render("movies/addMovie", {
    movie: null,
    error: [],
    warnings: [],
    success: null
    });
});

router.post("/movie/add", isLoggedIn, isAdmin, movieController.movieAdd);

router.post("/movie/delete/:id", isLoggedIn, isAdmin, movieController.movieRemove);

router.get("/movie/edit/:id", isLoggedIn, isAdmin, movieController.movieEdit)

router.post("/movie/edit/:id", isLoggedIn, isAdmin, movieController.movieUpdate);

router.get("/movie/:id", isLoggedIn, movieController.movieDesc);

module.exports = router;
