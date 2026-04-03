// ===================== IMPORT =====================
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const watchedControllers = require("../controllers/watched-controllers.js")

// notes: route to add watched movies with :id as it's parameter /add is only there for readability
// Handle add movie to watched list request
router.post("/watched/add/:id", isLoggedIn, watchedControllers.addWatchedMovies);

// View all user watched movies
router.get("/watched", isLoggedIn, watchedControllers.viewWatchedMovies);

// Remove single watched movie from wathcedlist
router.post("/watched/remove/:id", isLoggedIn, watchedControllers.removeWatchedMovies);

// Edit watched description
router.post("/watched/editdesc", isLoggedIn, watchedControllers.editWatchedDesc);

// ===================== EXPORT =====================
module.exports = router;