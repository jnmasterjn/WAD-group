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
});

module.exports = mongoose.model("Watchedlist", watchedMoviesSchema, "watchedlists") //model name, schema, the name of the collection in mongodb atlas