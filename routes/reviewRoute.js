// ===================== IMPORT =====================
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const reviewController = require("../controllers/review-controllers")

// View all reviews by the current user
router.get("/myReviews", isLoggedIn, reviewController.viewMyReviews)

// Handle form submission (create new review)
router.post("/myReviews", isLoggedIn, reviewController.postReview);

// Show edit form
router.get("/review/edit/:id", isLoggedIn, reviewController.viewEditReview)

// Handle submit edited review request
router.post("/review/edit/:id", isLoggedIn,reviewController.editReview)

// Handle delete review request
router.post("/review/delete/:id", isLoggedIn, reviewController.deleteReview)

// ===================== EXPORT =====================
module.exports = router;