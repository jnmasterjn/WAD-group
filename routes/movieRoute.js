// ===================== IMPORTS =====================
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { isLoggedIn, isAdmin } = require("../middleware/auth");
const movieController = require("../controllers/movie-controllers")


// Get all movies
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

// Handle add movie request (admin only)
router.post("/movie/add", isLoggedIn, isAdmin, movieController.movieAdd);

// Show edit movie form (admin only)
router.post("/movie/delete/:id", isLoggedIn, isAdmin, movieController.movieRemove);

// Show edit movie form (admin only)
router.get("/movie/edit/:id", isLoggedIn, isAdmin, movieController.movieEdit)

// Show edit movie form (admin only)
router.post("/movie/edit/:id", isLoggedIn, isAdmin, movieController.movieUpdate);

// Get movie details by id  
router.get("/movie/:id", isLoggedIn, movieController.movieDesc);


// ===================== EXPORT =====================
module.exports = router;
