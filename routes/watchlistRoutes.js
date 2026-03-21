const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Movie = require("../models/movie");
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
router.get("/watchlist", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.session.userId);

    const movies = await Movie.find({
        _id: { $in: user.watchlist }
    });

    res.render("watchlist", {
        username: req.session.username,
        movies
    });
});

module.exports = router;

//Remove
router.post("/watchlist/remove/:id", isLoggedIn, async (req, res) => {
    const movieId = req.params.id;

    await User.findByIdAndUpdate(req.session.userId, {
        $pull: { watchlist: movieId }
    });

    res.redirect("/watchlist");
});

