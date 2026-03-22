// handles reviews

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const reviewController = require("../controllers/review-controllers")

//route to handle form submission (new review post)
router.post("/myReviews", isLoggedIn, reviewController.postReview)

//route to get the reviews page
router.get("/myReviews", isLoggedIn, reviewController.viewMyReviews)

module.exports = router;