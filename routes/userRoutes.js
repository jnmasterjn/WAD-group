// ===================== IMPORT =====================
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const userController = require("../controllers/user-controllers")

// Show register form
router.get("/register", (req, res) => {
    res.render("register", {error:null, success: null})
})

// Handle register logic
router.post("/register", userController.registerLogic);

// Show login form
router.get("/login", (req, res) => {

    //logged in user cannot access /login again
    if (req.session.userId) {
        return res.redirect("/movie");
    }

    const success = req.session.success;

    //remove after showing once
    req.session.success = null
    
    res.render("login", { error:null, success})
})

// Handle login logic
router.post("/login", userController.loginLogic);

// Handle logout logic
router.post("/logout", isLoggedIn, (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
}); 

// Show user profile page
router.get("/profile", isLoggedIn, userController.profile);

// Handle user create bio request
router.post("/profile/bio", isLoggedIn, userController.createBio)

// Handle user edit bio request
router.post("/profile/bio/edit", isLoggedIn, userController.editBio)

// Landing page
router.get("/", (req, res) => {
    res.render("index", { username: req.session.username || null })
});

// delete user
router.post("/profile/delete", isLoggedIn, userController.deleteUser);

// ===================== EXPORT =====================
module.exports = router;
