const mongoose = require("mongoose");

// Like schema stores which user liked which review
const likeSchema = new mongoose.Schema({

    // reference to the user who liked the review
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // reference to the review being liked
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true
    },

    // timestamp for when the like was created
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    // removes the default "__v" field (version key)
    versionKey: false
});

// prevent duplicate likes (a user can only like a review once)
likeSchema.index({ user: 1, review: 1 }, { unique: true });

// export the model
module.exports = mongoose.model("Like", likeSchema);