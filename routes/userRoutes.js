const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
<<<<<<< Updated upstream
const userController = require("../controllers/user-controllers")
=======
const Movie = require("../models/movie");
>>>>>>> Stashed changes

//reg page
router.get("/register", (req, res) => {
    res.render("register", {error:null})
})

//login page
router.get("/login", (req, res) => {
    res.render("login", { error:null })
})

//reg logic
router.post("/register", userController.registerLogic);

//login logic
router.post("/login", userController.loginLogic);

//logout
router.get("/logout", (req, res) => {
    req.session.userId = null;
    req.session.username = null;
    res.redirect("/login");
});

//profile
<<<<<<< Updated upstream
router.get("/profile", isLoggedIn, userController.profile);
=======
router.get("/profile", isLoggedIn, async(req, res) => {

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
        user,
        recentlyMovies: orderedMovies
    })
})
>>>>>>> Stashed changes

//landing page
router.get("/", (req, res) => {
    res.render("index", { username: req.session.username || null })
});

module.exports = router;