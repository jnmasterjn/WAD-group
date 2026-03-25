const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const userController = require("../controllers/user-controllers")

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
    // req.session.userId = null;
    // req.session.username = null;
    // res.redirect("/login");
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}); 

//profile
router.get("/profile", isLoggedIn, userController.profile);

//landing page
router.get("/", (req, res) => {
    res.render("index", { username: req.session.username || null })
});

//user create bio
router.post("/profile/bio", isLoggedIn, userController.createBio)


//user edit bio
router.post("/profile/bio/edit", isLoggedIn, userController.editBio)

module.exports = router;
