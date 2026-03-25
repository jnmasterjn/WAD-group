const mongoose = require("mongoose");
const User = require("../models/user");
const Movie = require("../models/movie");

// Controller function to add watched movies to Watched Movies list

exports.addWatchedMovies = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id); 
        
        await User.findByIdAndUpdate(req.session.userId, { // finds the logged in user in the database using their session ID and updates them in one operation
            $addToSet: { watchedMovies: movieId } // addToSet instead of push to prevent duplicates
        });
        res.redirect("/watched");
    } catch (error) {
        console.error(error);
        res.send("Failed to update watched movies list");
    }
};

exports.viewWatchedMovies = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const movies = await Movie.find({ _id: { $in: user.watchedMovies } }); //find all movies that's id is in the watchedMovies list
        res.render("watched-movies", { username: req.session.username, movies });
    } catch (error) {
        console.error(error);
        res.send("Failed to load watchlist");
    }
};

exports.removeWatchedMovies = async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id); // gets the movie id from the URL and turns it from String into an Object Id to avoid data type error

        // fetch user
        const user = await User.findById(req.session.userId); // finds the logged in user based on their Id

        // normalize all watchedMovies items to ObjectId from the user's watchedMovies array
        const normalizedWatched = user.watchedMovies.map(id => {
            return id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id); // instanceof checks if the id is an objectId if it is leave it alone else turn it into an objectId
        });
        
        await User.findByIdAndUpdate(req.session.userId, {
            $set: { watchedMovies: normalizedWatched}
        });

        await User.findByIdAndUpdate(req.session.userId, {
            $pull: { watchedMovies: movieId }
        });
        
        res.redirect("/watched");
    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};