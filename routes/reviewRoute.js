// handles reviews

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const reviewController = require("../controllers/review-controllers")

//route to handle form submission (new review post)
router.post("/myReviews", isLoggedIn, reviewController.postReview)

//route to get the reviews page
router.get("/myReviews", isLoggedIn, reviewController.viewMyReviews)

//edit review (show the current review page)
router.get("/review/edit/:id", isLoggedIn,reviewController.viewEditReview)

//edit review
router.post("/review/edit/:id", isLoggedIn,reviewController.editReview)

//delete review
router.post("/review/delete/:id", isLoggedIn, reviewController.deleteReview)

module.exports = router;