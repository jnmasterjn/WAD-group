const User = require("../models/user");
const Movie = require("../models/movie");

// Controller function to add to watchlist

exports.addMovietoWatchlist = async (req, res) => {
    try {
        const movieId = req.params.id;

        await User.findByIdAndUpdate(req.session.userId, {
            $addToSet: { watchlist: movieId }
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

exports.removeMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        await User.findByIdAndUpdate(req.session.userId, { $pull: { watchlist: movieId } });
        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Failed to remove movie");
    }
};
