// ===================== IMPORT =====================
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const watchlistControllers = require("../controllers/watchlist-controllers");

// Handle add movie to watchlist request
router.post("/watchlist/add/:id", isLoggedIn, watchlistControllers.addMovietoWatchlist);

// Show the user's watchlist
router.get("/watchlist", isLoggedIn, watchlistControllers.viewWatchlist);

// Handle remove movie from watchlist request 
router.post("/watchlist/remove/:id", isLoggedIn, watchlistControllers.removeWatchlistMovie);

// Edit watchlist desc
router.post("/watchlist/editdesc", isLoggedIn, watchlistControllers.editWatchlistDesc);


// ===================== EXPORT =====================
module.exports = router;
