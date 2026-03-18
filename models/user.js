// Without this file mongoDB wouldn't know the structure of the user data

//to store the user ID, username, email, password, when they joined, what movies are in their watchlist, and whether they're an admin or user(we use bool here as there are only 2 roles)

// Loads mongoose (the tool that connects node.js to mongodb)
const mongoose = require("mongoose")

//creates sthe schema
const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: [true, 'A user must have an ID']
    },
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("User", userSchema)