// ===================== IMPORTS =====================
const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like-controllers");

// Review Interaction
// If user already liked → unlike
// If user hasn't liked → create like
router.post("/like/:id", likeController.toggleLike);


// ===================== EXPORT =====================
module.exports = router;