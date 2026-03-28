const bcrypt = require("bcrypt");
const User = require("../models/user");
const Movie = require("../models/movie");
const Review = require("../models/review");

//register logic
exports.registerLogic = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("register", { error: "All fields are required", success: null });
    }
    //password must > 6
    if (password && password.length < 6) {
        return res.render("register", { error: "Password must be at least 6 characters", success: null });
    }

    try {
        //check if username appear in db alr or not
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("register", { error: "Username already exists", success: null })
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashed
        });

        await user.save();
        return res.render("register", { success: "Account created successfully!", error: null });

    } catch (err) {
        console.log(err)
        res.render("register", { error: "Something went wrong, please try again.", success: null });
    }
};

// login logic
exports.loginLogic = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.render("login", { error: "User not found", success: false})
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.render("login", { error: "Password does not match", success: false})
        }

        //session
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.isAdmin = user.isAdmin;

        res.redirect("/movie")

    } catch (err) {
        console.log(err)
        res.render("login", { error: "Something went wrong, please try again." , success: false})
    }
};

// profile
exports.profile = async (req, res) => {
    try {
        // get user and populate their watchlist with full movie data
        const user = await User.findById(req.session.userId).populate("watchlist");

        // get all reviews by this user, and populate the movie info
        const userReviews = await Review.find({ user: req.session.userId }).populate("movie");

        // recommended movies: get genres from watchlist, find movies NOT in watchlist
        let recommendedMovies = [];
        if (user.watchlist.length > 0) {
            // collect genres from watchlist
            const genres = [...new Set(user.watchlist.map(movie => movie.genre))];

            // find movies with same genres but NOT already in watchlist
            const watchlistIds = user.watchlist.map(movie => movie._id);
            recommendedMovies = await Movie.find({
                genre: { $in: genres },
                _id: { $nin: watchlistIds }
            }).limit(10);
        }

        res.render("profile", {
            user,
            watchlistMovies: user.watchlist,
            recommendedMovies,
            userReviews
        });

    } catch (err) {
        console.error(err);
        res.send("Failed to load profile");
    }
};

//create bio
exports.createBio = async (req, res) => {
    const bio = req.body.bio

    try{
        await User.findByIdAndUpdate(req.session.userId, {bio});

        res.redirect("/profile")

    }catch(err){
        res.send("Failed to update bio")
    }
}

exports.editBio = async(req, res) => {
    const {bio} = req.body

    try{
        await User.findByIdAndUpdate(req.session.userId, { bio });

        res.redirect("/profile");
    }catch(err){
        res.send("Failed to edit bio")
    }
}