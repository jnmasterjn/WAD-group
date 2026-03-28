// Without this file mongoDB wouldn't know the structure of the user data

//to store the user ID, username, email, password, when they joined, what movies are in their watchlist, and whether they're an admin or user(we use bool here as there are only 2 roles)

// Loads mongoose (the tool that connects node.js to mongodb)
const mongoose = require("mongoose")

//creates the schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A user must have a username'], 
        unique: [true, 'A username must be unique'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A user must have a password']  
    },
    bio:{
        type:String,
        default:""
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
// the timestamps thing will auto add createdAt (when user registered), updatedAt

module.exports = mongoose.model("User", userSchema, "users")