const mongoose = require("mongoose");
const Movie = require("../models/movie");
const Watchedlist = require("../models/watchedlist");
const Watchlist = require("../models/watchlist");

// Controller function to add to watched movies list
exports.addWatchedMovies = async (req, res) => {
    try {
        // parse the movie id from the url to a variable called movieId
        const movieId = new mongoose.Types.ObjectId(req.params.id);
        
        // look into watchedlist schema and find the current session's user and add movieId to their watchedlist movies
        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId },
            { $addToSet: {movies: movieId} }
        )

        //remove that movie from that users watchlist if it exists
        await Watchlist.findOneAndUpdate(
            { user: req.session.userId },
            { $pull: {movies: movieId} }
        )
        // redirect back to previous page, if cannot refer go back to /movies
        res.redirect(req.get("referer") || "/movies");


    } catch (error) {
        console.error(error);
        res.send("Failed to update watched movies list");
    }
};

// Controller function to view watched movies
exports.viewWatchedMovies = async (req, res) => {
    try {
        // query watchedlist schema to find information that belongs to current session's user
        const watchedlist = await Watchedlist.findOne({ user: req.session.userId });

        // redirect to login if watchedlist is not found
        if (!watchedlist) return res.redirect("/login");

        // retrieve watchedlistDesc from watchedlist
        const watchedlistdesc = watchedlist.watchedlistDesc;

        // find all movies that's id is in the watchedMovies list
        const movies = await Movie.find({ _id: { $in: watchedlist.movies } });

        // render watched-movies.ejs and pass username, movies, and watchedlist description into it
        res.render("watched-movies", { username: req.session.username, movies, watchedlistdesc });
    } catch (error) {
        console.error(error);
        res.send("Failed to load watched movies list");
    }
};

// Controller function to remove from watched movies list
exports.removeWatchedMovies = async (req, res) => {
    try {
        // parse the movie id from the url to a variable called movieId
        const movieId = new mongoose.Types.ObjectId(req.params.id);

        // look into watchedlist schema and find the current session's user and remove movieId from their watchedlist movies
        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId }, 
            { $pull: { movies: movieId } }
        );
        // redirect back to prev page, if cannot refer go back to /watched
        res.redirect(req.get("referer") || "/watched");


    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};

// Controller function to edit watched movies description
exports.editWatchedDesc = async(req, res) => {
    try {
        // retrieve the new description from the form submission
        const watchedlistdesc = req.body.watchedlistdesc;

        // find the current session's user's watchedlist and update their description
        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId },
            { watchedlistDesc: watchedlistdesc }
        );

        // redirect back to the watched movies page
        res.redirect("/watched")
    } catch(err){
        console.log(err)
        res.send("Error updating watched movies description")
    }
};