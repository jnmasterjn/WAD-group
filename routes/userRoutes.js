const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const isLoggedIn = require("../middleware/auth");

//reg page
router.get("/register", (req, res) => {
    res.render("register", {error:null})
})

//login page
router.get("/login", (req, res) => {
    res.render("login", { error:null })
})

//reg logic
router.post("/register", async (req, res) => {

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
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.render("register", {error: "Username already exists"})
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
});

//login logic
router.post("/login", async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.render("login", {error: "User not found"})
        }
    
        const match = await bcrypt.compare(password, user.password)
    
        if (!match){
            return res.render("login", {error: "Password does not match"})
        }
        
        //session
        req.session.userId = user._id;
        req.session.username = user.username;

        res.redirect("/movie")
    
    }catch(err){
        console.log(err)
        res.render("login", {error: "Something went wrong, please try again."})
    }
})

//logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

//landing page
router.get("/", (req, res) => {
    res.render("index", { username: req.session.username || null })
});

//watchlist page
router.get("/watchlist", isLoggedIn, (req, res) => {
    res.render("watchlist")
})

//add-to-watchlist
router.post("/add-to-watchlist/:movieId", isLoggedIn, (req, res) => {
    console.log(req)
})

module.exports = router;