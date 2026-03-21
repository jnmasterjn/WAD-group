const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const watchlistController = require("../controllers/watchlist-controllers");

router.post("/watchlist/add/:id", isLoggedIn, watchlistController.addMovietoWatchlist);

// View watchlist
router.get("/watchlist", isLoggedIn, watchlistController.viewWatchlist);

//Remove
router.post("/watchlist/remove/:id", isLoggedIn, watchlistController.removeMovie);

module.exports = router;