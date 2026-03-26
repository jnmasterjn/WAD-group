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
        res.redirect(`/movie/${movie}`); //back to moview detail page
    } catch (err) {
        console.error("Error saving review:", err);
        res.send(err.message)
    }
}

//route to get the my review page (all comments current user left)
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

// view edit review
exports.viewEditReview = async(req, res) => {
    const review = await Review.findById(req.params.id)

    res.render("editReview", {review})
}

//edit review
exports.editReview = async(req, res) => {
    const {comment, rating} = req.body

    try{
        //1. find review with this ID, 
        //2. replace comment + rating
        await Review.findByIdAndUpdate(req.params.id, {comment, rating})
        res.redirect("/myReviews")

    }catch(err){
        console.log(err)
        res.send("Error updating review")
    }
}

//delete review
exports.deleteReview = async(req, res) => {
    try{
        await Review.findByIdAndDelete(req.params.id)
        res.redirect("/myReviews")

    }catch(err){
        console.log(err)
        res.send("Error deleting review")
    }
}