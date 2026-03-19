const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/register", (req, res) => res.render("register", { error: null }));

router.get("/login", (req, res) => res.render("login", { error: null }));

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.render("register", { error: "All fields are required" });
    }
    if (password.length < 6) {
        return res.render("register", { error: "Password must be at least 6 characters" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.render("register", { error: "Invalid email format" });
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        res.render("register", { error: "Username or email already exists" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.render("login", { error: "User not found" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render("login", { error: "Wrong password" });
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect("/watchlist");
    } catch (err) {
        res.render("login", { error: "Something went wrong" });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

router.get("/watchlist", (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    res.render("watchlist", { username: req.session.username });
});

router.get("/my-reviews", (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    res.render("myReviews", { username: req.session.username });
});

//landing page
router.get("/", (req, res) => {
    res.render("index")
});

module.exports = router;
