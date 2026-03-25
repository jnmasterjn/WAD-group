const mongoose = require("mongoose");
const User = require("../models/user");
const Movie = require("../models/movie");

// Controller function to add to watchlist

exports.addMovietoWatchlist = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id); // convert string to ObjectId

        await User.findByIdAndUpdate(req.session.userId, {
            $addToSet: { watchlist: movieId }, // now stored as ObjectId
            $pull: { watchedMovies: movieId }
        });
        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Failed to update watchlist");
    }
};

exports.viewWatchlist = async (req, res) => {
try {
        const user = await User.findById(req.session.userId);
        const movies = await Movie.find({ _id: { $in: user.watchlist } });
        res.render("watchlist", { username: req.session.username, movies });
    } catch (error) {
        console.error(error);
        res.send("Failed to load watchlist");
    }
};

exports.removeWatchlistMovie = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id);

        // Fetch the user
        const user = await User.findById(req.session.userId);

        // Normalize all watchlist items to ObjectId
        const normalizedWatchlist = user.watchlist.map(id => {
            // if already objectId, leave it; if string, convert
            return id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id);
        });

        // update the watchlist with normalized objectIds
        await User.findByIdAndUpdate(req.session.userId, { $set: { watchlist: normalizedWatchlist } });

        // remove movie
        await User.findByIdAndUpdate(req.session.userId, { $pull: { watchlist: movieId } });

        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};
