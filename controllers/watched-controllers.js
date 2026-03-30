const mongoose = require("mongoose");
const User = require("../models/user");
const Movie = require("../models/movie");
const Watchedlist = require("../models/watchedlist");
const Watchlist = require("../models/watchlist");

// Controller function to add watched movies to Watched Movies list

exports.addWatchedMovies = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id);
        
        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId },
            { $addToSet: {movies: movieId} }
        )

        //remove watchlist movie
        await Watchlist.findOneAndUpdate(
            { user: req.session.userId },
            { $pull: {movies: movieId} }
        )

        res.redirect("/movie");
    } catch (error) {
        console.error(error);
        res.send("Failed to update watched movies list");
    }
};

exports.viewWatchedMovies = async (req, res) => {
    try {
        const watchedlist = await Watchedlist.findOne({ user: req.session.userId })
        const watchedlistdesc = watchedlist.watchedlistDesc
        const movies = watchedlist ? await Movie.find({ _id: { $in: watchedlist.movies } }) : [] ; //find all movies that's id is in the watchedMovies list
        res.render("watched-movies", { username: req.session.username, movies, watchedlistdesc });
    } catch (error) {
        console.error(error);
        res.send("Failed to load watched movies list");
    }
};

exports.removeWatchedMovies = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id); // gets the movie id from the URL and turns it from String into an Object Id to avoid data type error

        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId }, 
            { $pull: { movies: movieId } }
        );

        res.redirect("/watched");
    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};

exports.editWatchedDesc = async(req, res) => {
    try {
        const watchedlistdesc = req.body.watchedlistdesc;

        await Watchedlist.findOneAndUpdate(
            { user: req.session.userId },
            { watchedlistDesc: watchedlistdesc }
        );

        res.redirect("/watched")
    } catch(err){
        console.log(err)
        res.send("Error updating watched movies description")
    }
};