// ===================== IMPORT =====================
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const reviewController = require("../controllers/review-controllers");

// View all reviews by the current logged-in user
router.get("/myReviews", isLoggedIn, reviewController.viewMyReviews);

// Handle form submission (create review)
router.post("/myReviews", isLoggedIn, reviewController.postReview);

// Prevent direct access to edit URL via Get. Redirects to user's review page instead
router.get("/review/edit/:id", isLoggedIn, (req, res) => res.redirect("/myReviews"));

// Submit review after editing rating and/or comment
router.post("/review/edit/:id", isLoggedIn, reviewController.editReview);

// Handle delete review request
router.post("/review/delete/:id", isLoggedIn, reviewController.deleteReview);

// ===================== EXPORT =====================
module.exports = router;