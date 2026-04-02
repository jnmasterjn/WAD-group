const bcrypt = require("bcrypt");
const User = require("../models/user");
const Movie = require("../models/movie");
const Watchlist = require("../models/watchlist");
const Watchedlist = require("../models/watchedlist");
const Review = require("../models/review");


// Register logic
exports.registerLogic = async (req, res) => {
    const { username, password } = req.body;

    // check if username and password fields are filled
    if (!username || !password) {
        return res.render("register", { error: "All fields are required", success: null });
    }
    // password must > 6
    if (password && password.length < 6) {
        return res.render("register", { error: "Password must be at least 6 characters", success: null });
    }

    try {
        // check if username already exists in the database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("register", { error: "Username already exists", success: null })
        }

        // hash the password before saving
        const hashed = await bcrypt.hash(password, 10);

        // saves user to database
        const user = new User({ username, password: hashed });
        await user.save();

        // create new empty watchedlist for user
        const watchedlist = new Watchedlist({ user: user._id, movies: [] });
        await watchedlist.save();

        // create new empty watchlist for user
        const watchlist = new Watchlist({ user: user._id, movies: [] });
        await watchlist.save();

        // redirect to login page with success message
        req.session.success = "Account created successfully!";
        res.redirect("/login");

    } catch (err) {
        console.log(err)
        res.render("register", { error: "Registration failed. Please try again.", success: null });    }
};

// Login logic
exports.loginLogic = async (req, res) => {
    const { username, password } = req.body

    try {
        // check if username exists in the database, only include "password" here
        const user = await User.findOne({ username }).select("+password");

        if (!user) {
            return res.render("login", { error: "User not found", success: false })
            return res.render("login", { error: "Username or password is incorrect", success: false })
        }

        // compare submitted password with hashed password in database
        const match = await bcrypt.compare(password, user.password)

        if (!match) {
<<<<<<< HEAD
            return res.render("login", { error: "Username and password does not match", success: false })
=======
            return res.render("login", { error: "Username or password is incorrect", success: false })
>>>>>>> 192f88d1850dce7d685a1be97dde0575d1a24436
        }

        // session
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.isAdmin = user.isAdmin;

        res.redirect("/movie")

    } catch (err) {
        console.log(err)
        res.render("login", { error: err.message, success: false })
    }
};

// Profile
exports.profile = async (req, res) => {
    try {

        const users = await User.findById(req.session.userId);

        // get recently viewed movie ids from session
        const recentlyIds = req.session.recentlyViewed || [];

        // get full movie data for recently viewed movies
        const recentlyMovies = await Movie.find({
            _id: { $in: recentlyIds }
        });

        // reorder movies to match recently viewed order
        let orderedMovies = [];
        for (let i = 0; i < recentlyIds.length && orderedMovies.length < 7; i++) {
            for (let j = 0; j < recentlyMovies.length; j++) {
                if (recentlyMovies[j]._id.toString() === recentlyIds[i].toString()) {
                    orderedMovies.push(recentlyMovies[j]);
                }
            }
        }

        const user = await User.findById(req.session.userId);

        // get watchlist document and populate with full movie data
        const watchlist = await Watchlist.findOne({ user: req.session.userId }).populate("movies");

        // get all reviews by this user and populate movie info
        const userReviews = await Review.find({ user: req.session.userId }).populate("movie");

        // recommended movies based on watchlist genres
        let recommendedMovies = [];
        if (watchlist && watchlist.movies.length > 0) {
            // get unique genres from watchlist movies
            const genres = [...new Set(watchlist.movies.map(movie => movie.genre))];
            // get ids of movies already in watchlist to exclude them
            const watchlistIds = watchlist.movies.map(movie => movie._id);
            // find movies matching watchlist genres that aren't already in the watchlist
            recommendedMovies = await Movie.find({
                genre: { $in: genres },
                _id: { $nin: watchlistIds }
            }).limit(10);
        }

        // render profile page and pass all relevant data into it
        res.render("profile", {
            users,
            recentlyMovies: orderedMovies,
            user,
            watchlistMovies: watchlist ? watchlist.movies : [],
            recommendedMovies,
            userReviews
        });

    } catch (err) {
        console.error(err);
        res.send("Failed to load profile");
    }
};

// Create bio
exports.createBio = async (req, res) => {
    // retrieve the new bio from the form submission
    const bio = req.body.bio

    try {
        // find the current session's user and update their bio
        await User.findByIdAndUpdate(req.session.userId, { bio });

        // redirect back to the profile page
        res.redirect("/profile")

    } catch (err) {
        res.send("Failed to update bio")
    }
}

exports.editBio = async (req, res) => {
    // retrieve the updated bio from the form submission
    const { bio } = req.body

    try {
        // find the current session's user and update their bio
        await User.findByIdAndUpdate(req.session.userId, { bio });

        // redirect back to the profile page
        res.redirect("/profile");
    } catch (err) {
        res.send("Failed to edit bio")
    }
}