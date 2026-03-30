const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like-controllers");


router.post("/like/:id", likeController.toggleLike);

module.exports = router;