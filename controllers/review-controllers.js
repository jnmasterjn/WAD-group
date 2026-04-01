const Movie = require("../models/movie");
const Review = require("../models/review");

// helper function to recalculate movie average
async function updateMovieAverage(movieId) {
    const allReviews = await Review.find({ movie: movieId });
    const reviewsWithRating = allReviews.filter(r => r.rating !== null);

    let sum = 0;
    for (const r of reviewsWithRating) {
        sum += r.rating
    }
    
    const average = reviewsWithRating.length ? sum / reviewsWithRating.length : 0;

    await Movie.findByIdAndUpdate(movieId, {
        averageRating: average,
        ratingsCount: reviewsWithRating.length
    });
}

// post review
exports.postReview = async(req, res) => {
    const { comment, rating, movie } = req.body;

    //user cannot enter empty comment or comment > 50 words
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
        return res.send("Comment cannot be empty");
    }

    const wordCount = trimmedComment.split(/\s+/).length;

    if (wordCount > 50) {
        return res.send("Comment cannot exceed 50 words");
    }

    try {
        // Only include rating if user provided it
        const reviewData = { comment, movie, user:req.session.userId, username: req.session.username};
        if (rating) reviewData.rating = Number(rating); 

        const newReview = new Review(reviewData)
        await newReview.save();

        // recalculate movie average rating
        await updateMovieAverage(movie);

        res.redirect(`/movie/${movie}`);
    } catch (err) {
        // handle duplicate review error
        if (err.code === 11000) {
            return res.send("You already reviewed this movie!")
        }

        console.error("Error saving review:", err);
        res.send("Error saving your review");
    }
};

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

//edit review
exports.editReview = async(req, res) => {
    const {comment, rating} = req.body

    //user cannot enter empty comment or comment > 50 words
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
        return res.send("Comment cannot be empty");
    }

    const wordCount = trimmedComment.split(/\s+/).length;

    if (wordCount > 50) {
        return res.send("Comment cannot exceed 50 words");
    }

    try {
        const review = await Review.findByIdAndUpdate(req.params.id, {comment, rating}, {new: true});

        //recalculate average for this movie
        await updateMovieAverage(review.movie);

        // go back to previous page
        const back = req.get("referer") || "/myReviews";
        res.redirect(back)

    } catch(err){
        console.log(err)
        res.send("Error updating review")
    }
}

// delete review
exports.deleteReview = async(req, res) => {
    try{
        const review = await Review.findByIdAndDelete(req.params.id);

        if (review) {
            // recalculate average for this movie
            await updateMovieAverage(review.movie);
        }
        // go back to previous page
        const back = req.get("referer") || "/myReviews";
        res.redirect(back)
        
    }catch(err){
        console.log(err)
        res.send("Error deleting review")
    }
}

// view edit review
exports.viewEditReview = async(req, res) => {
    const review = await Review.findById(req.params.id)

    res.render("editReview", {review})
}
