const mongoose = require("mongoose");
const Movie = require("../models/movie");
const Watchlist = require("../models/watchlist");
const Watchedlist = require("../models/watchedlist");

// Controller function to add to watchlist

exports.addMovietoWatchlist = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id); // convert string to ObjectId

        await Watchlist.findOneAndUpdate(
            { user: req.session.userId },
            { $addToSet: {movies: movieId} }
        );

        //remove watchlist movie
        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId },
            { $pull: {movies: movieId} }
        );

        res.redirect("/watchlist")

    } catch (error) {
        console.error(error);
        res.send("Failed to update watchlist");
    }
};

exports.viewWatchlist = async (req, res) => {
try {
        const watchlist = await Watchlist.findOne({ user: req.session.userId })
        const movies = watchlist ? await Movie.find({ _id: { $in: watchlist.movies } }) : [] ; //find all movies that's id is in the watchedMovies list
        res.render("watchlist", { username: req.session.username, movies });
    } catch (error) {
        console.error(error);
        res.send("Failed to load watchlist");
    }
};

exports.removeWatchlistMovie = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id);
        
        await Watchlist.findOneAndUpdate(
            { user: req.session.userId }, 
            { $pull: { movies: movieId } }
        );

        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};
