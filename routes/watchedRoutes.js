const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const watchedControllers = require("../controllers/watched-controllers.js")

// route to add watched movies with :id as it's parameter /add is only there for readability
router.post("/watched/add/:id", isLoggedIn, watchedControllers.addWatchedMovies);

router.get("/watched", isLoggedIn, watchedControllers.viewWatchedMovies);

router.post("/watched/remove/:id", isLoggedIn, watchedControllers.addWatchedMovies); //function not implemented yet

module.exports = router;