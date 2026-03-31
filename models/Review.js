
const mongoose = require("mongoose")

// Create a new 'review' schema
const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Movie",
        required: true
    },
    comment:{
        type: String,
        required: true,
        maxlength: [600, "Review cannot exceed 500 characters"]
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
},
    {
        timestamps:true
    }
)

// prevent duplicate reviews
reviewSchema.index({user: 1, username: 1, movie: 1}, { unique: true })

module.exports = mongoose.model("Review", reviewSchema, "reviews")