// Without this file mongoDB wouldn't know the structure of the user data

// Loads mongoose (the tool that connects node.js to mongodb)
const mongoose = require("mongoose")

//creates sthe schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A user must have a username']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email']
    },
    password: {
        type: String,
        required: [true, 'A user must have a password']  
    },
    joinedAt: {
        type: Date,
        default: Date.now 
    },
    watchlist: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("User", userSchema)
