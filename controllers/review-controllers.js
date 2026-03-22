const Movie = require("../models/movie");
const User = require("../models/user");
const Review = require("../models/review");

//route to handle form submission (new review post)
exports.postReview = async(req, res) => {
    const { comment, rating, movie } = req.body;

    if (!comment) return res.send("Comment is required!");

    try {
        const newReview = new Review({ comment, rating, movie, user:req.session.userId, username: req.session.username});
        await newReview.save(); // save to mongoDB
        res.redirect('/movie');
    } catch (err) {
        console.error("Error saving review:", err);
        res.send(err.message)
    }
}


//route to get the reviews page
exports.viewMyReviews = async (req, res) => {
    try {
        // get all reviews
        //user and movie come from movie review schema
        //populate = convert ID → full object from another collection
        const reviews = await Review.find({ user: req.session.userId }).populate("user").populate("movie"); 
        res.render("myReviews", { reviews });
    } catch (err) {
        console.error(err);
        res.send("Error loading reviews");
    }
}