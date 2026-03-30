const mongoose = require("mongoose")

//creates the schema
const watchedMoviesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }],
    watchedlistDesc: {
        type: String,
        default: ""
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Watchedlist", watchedMoviesSchema, "watchedlists") //model name, schema, the name of the collection in mongodb atlas