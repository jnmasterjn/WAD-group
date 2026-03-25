const bcrypt = require("bcrypt");
const User = require("../models/user");
const Movie = require("../models/movie");

//register logic
exports.registerLogic = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("register", { error: "All fields are required" });
    }
    //password must > 6
    if (password && password.length < 6) {
        return res.render("register", { error: "Password must be at least 6 characters" });
    }

    try {
        //check if username appear in db alr or not
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("register", { error: "Username already exists" })
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashed
        });

        await user.save();
        res.redirect("/login");

    } catch (err) {
        console.log(err)
        res.render("register", { error: "Something went wrong, please try again." });
    }
};

// login logic
exports.loginLogic = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.render("login", { error: "User not found" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.render("login", { error: "Password does not match" })
        }

        //session
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.isAdmin = user.isAdmin;

        res.redirect("/movie")

    } catch (err) {
        console.log(err)
        res.render("login", { error: "Something went wrong, please try again." })
    }
};

// profile
exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);

        const recentlyIds = req.session.recentlyViewed || [];
        const recentlyMovies = await Movie.find({
            _id: { $in: recentlyIds }
        });

        let orderedMovies = [];
        for (let i = 0; i < recentlyIds.length; i++) {
            for (let j = 0; j < recentlyMovies.length; j++) {
                if (recentlyMovies[j]._id.toString() === recentlyIds[i].toString()) {
                    orderedMovies.push(recentlyMovies[j]);
                }
            }
        }

        res.render("profile", {
            user, //so in profile that page can access user. stuff
            recentlyMovies: orderedMovies
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