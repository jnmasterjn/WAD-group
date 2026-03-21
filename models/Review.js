// review db
//include....
    // id
    // user_id
    // movie_id
    // rating
    // comment
    // created_at

const mongoose = require("mongoose")

// Create a new 'review' schema
const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
    },
    movie:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Movie",
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    }
},
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Review", reviewSchema, "reviews")