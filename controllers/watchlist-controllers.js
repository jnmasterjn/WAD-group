const mongoose = require("mongoose");
const Movie = require("../models/movie");
const Watchlist = require("../models/watchlist");
const Watchedlist = require("../models/watchedlist");

// Controller function to add to watchlist
exports.addMovietoWatchlist = async (req, res) => {
    try {
        // parse the movie id from the url to a variable called movieId
        const movieId = new mongoose.Types.ObjectId(req.params.id);

        // look into watchlist schema and find the current session's user and add movieId to their watchlist movies array
        await Watchlist.findOneAndUpdate(
            { user: req.session.userId },
            { $addToSet: { movies: movieId } }
        );

        // remove that movie from that user's watched list if it exists
        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId },
            { $pull: { movies: movieId } }
        );

        // redirect back to the movies page
        res.redirect("/movie")

    } catch (error) {
        console.error(error);
        res.send("Failed to update watchlist");
    }
};

exports.viewWatchlist = async (req, res) => {
    try {
        // query watchlist schema to find information that belongs to current session's user
        const watchlist = await Watchlist.findOne({ user: req.session.userId })

        // redirect to login if watchedlist is not found
        if (!watchlist) return res.redirect("/login");

        // retrieve watchlistDesc from watchlist
        const watchlistdesc = watchlist.watchlistDesc

        // find all movies whose id is in the watchlist movies array
        const movies = watchlist ? await Movie.find({ _id: { $in: watchlist.movies } }) : [];

        // render watchlist.ejs and pass username, movies, and watchlist description into it
        res.render("watchlist", { username: req.session.username, movies, watchlistdesc });
    } catch (error) {
        console.error(error);
        res.send("Failed to load watchlist");
    }
};

exports.removeWatchlistMovie = async (req, res) => {
    try {
        // parse the movie id from the url to a variable called movieId
        const movieId = new mongoose.Types.ObjectId(req.params.id);

        // find the current session's user's watchlist and remove movieId from their movies array
        await Watchlist.findOneAndUpdate(
            { user: req.session.userId },
            { $pull: { movies: movieId } }
        );

        // redirect back to the watchlist page
        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};

exports.editWatchlistDesc = async (req, res) => {
    try {
        // retrieve the new description from the form submission
        const watchlistdesc = req.body.watchlistdesc;

        // find the current session's user's watchlist and update their description
        await Watchlist.findOneAndUpdate(
            { user: req.session.userId },
            { watchlistDesc: watchlistdesc }
        );

        // redirect back to the watchlist page
        res.redirect("/watchlist")
    } catch (err) {
        console.log(err)
        res.send("Error updating watchlist description")
    }
};
