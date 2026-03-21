const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");

// Add to watchlist
router.post("/watchlist/add/:id", isLoggedIn, async (req, res) => {
    const movieId = req.params.id;

    await User.findByIdAndUpdate(req.session.userId, {
    $addToSet: { watchlist: movieId }
    });

    res.redirect("/watchlist");
});

// View watchlist
router.get("/watchlist", isLoggedIn, watchlistController.viewWatchlist);

//Remove
router.post("/watchlist/remove/:id", isLoggedIn, watchlistController.removeMovie);

module.exports = router;

//Remove
router.post("/watchlist/remove/:id", isLoggedIn, async (req, res) => {
    const movieId = req.params.id;

    await User.findByIdAndUpdate(req.session.userId, {
        $pull: { watchlist: movieId }
    });

    res.redirect("/watchlist");
});