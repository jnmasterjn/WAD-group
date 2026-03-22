const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const watchedControllers = require("../controllers/watched-controllers")

router.post("/watched/add/:id", isLoggedIn, watchedControllers.addWatchedMovies);

router.get("/watched", isLoggedIn, watchedControllers.viewWatchedMovies);

module.exports = router;