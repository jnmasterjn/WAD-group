
const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

// prevent duplicate likes
likeSchema.index({ user: 1, review: 1 }, { unique: true });
module.exports = mongoose.model("Like", likeSchema);