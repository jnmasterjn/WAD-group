// Without this file mongoDB wouldn't know the structure of the user data

// Loads mongoose (the tool that connects node.js to mongodb)
const mongoose = require("mongoose")

//creates sthe schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: "user" }, // tells the system what permissions the user has if no specification the default is role: "user"
    createdAt: { type: Date, default: Date.now } // automatically records when the account was created
})

module.exports = mongoose.model("User", userSchema)
