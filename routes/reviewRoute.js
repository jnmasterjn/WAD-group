// handles reviews

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const reviewController = require("../controllers/review-controllers")

// get: show form to create a new review
router.get("/review/new/:movieId", isLoggedIn, reviewController.viewNewReview);

// post: handle form submission (create new review)
router.post("/myReviews", isLoggedIn, reviewController.postReview);

//get: view all reviews by the current user
router.get("/myReviews", isLoggedIn, reviewController.viewMyReviews)

// get: show edit form for a review
router.get("/review/edit/:id", isLoggedIn, reviewController.viewEditReview)

//post: submit edited review
router.post("/review/edit/:id", isLoggedIn,reviewController.editReview)

//post: delete review
router.post("/review/delete/:id", isLoggedIn, reviewController.deleteReview)

module.exports = router;