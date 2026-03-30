const bcrypt = require("bcrypt");
const User = require("../models/user");
const Movie = require("../models/movie");
const Watchlist = require("../models/watchlist");
const Watchedlist = require("../models/watchedlist");
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

        // saves user to database
        const user = new User({ username, password: hashed });
        await user.save();

        // create new empty watchlist for user
        
        // create new empty watchedlist for user
        const watchedlist = new Watchedlist({ user: user._id, movies: [] });
        await watchedlist.save();

        // create new empty watchlist for user
        const watchlist = new Watchlist({ user: user._id, movies: [] });
        await watchlist.save();

        req.session.success = "Account created successfully!";
        res.redirect("/login");

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
            const genres = [...new Set(watchlist.movies.map(movie => movie.genre))];
            const watchlistIds = watchlist.movies.map(movie => movie._id);
            recommendedMovies = await Movie.find({
                genre: { $in: genres },
                _id: { $nin: watchlistIds }
            }).limit(10);
        }

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