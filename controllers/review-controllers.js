const Movie = require("../models/movie");
const Review = require("../models/review");
const { movieEdit } = require("./movie-controllers");

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


// post: save review
exports.postReview = async (req, res) => {
    const { comment, rating, movie } = req.body;

    try {
        // fetch data for rendering the page
        const ind_movie = await Movie.findById(movie);
        const reviews = await Review.find({ movie });
        const userReview = await Review.findOne({ movie, user: req.session.userId });

        // default values for template 
        const likeMap = {};
        const userLikedMap = {};
        const isInWatchlist = false; 
        const isInWatchedMovies = false;

        //Validation: comment cannot be empty
        const trimmedComment = comment.trim();
        if (!trimmedComment) {
            return res.render("movies/movieDetail", {
                ind_movie,
                reviews,
                userReview,
                isInWatchlist,
                isInWatchedMovies,
                likeMap,
                userLikedMap,
                error: "Comment cannot be empty"
            });
        }

        // check if user already reviewed
        if (userReview) {
            return res.render("movies/movieDetail", {
                ind_movie,
                reviews,
                userReview,
                isInWatchlist,
                isInWatchedMovies,
                likeMap,
                userLikedMap,
                error: "You already reviewed this movie! You can edit your review below."
            });
        }

    // save review 
    const newReview = new Review({
        comment, 
        rating: rating ? Number(rating) : undefined, 
        movie,
        user: req.session.userId,
        username: req.session.username
    });

    await newReview.save();

    // update average
    await updateMovieAverage(movie);

    //redirect back to movie page
    // res.redirect(`/movie/${movie}`);

     // go back to previous page
    const back = req.get("referer") || "/myReviews";
    res.redirect(back)

    } catch (err) {
        console.log("Error saving review:", err);
        res.send("Error saving your review");
    }
};

// get: show all reviews by user
exports.viewMyReviews = async (req, res) => {
    try {
        //get all reviews
        //user and movie come from movie review schema
        //populate = convert ID -> full object from another collection
        const reviews = await Review.find({ user: req.session.userId }).populate("user").populate("movie"); 
        res.render("myReviews", { reviews });
    } catch (err) {
        console.error(err);
        res.send("Error loading reviews");
    }
};

// get: show form to create a new review
exports.viewNewReview = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const movie = await Movie.findById(movieId);

        const existingReview = await Review.findOne({ user: req.session.userId, movie: movieId });
        if (existingReview) {
            return res.redirect(`/movie/${movieId}`); // already reviewed
        }
        res.render("newReview", { movie });
    } catch (err) {
        console.error(err);
        res.send("You already made a review. One review allowed only.")
    }
};

// get: show form to edit existing review
exports.viewEditReview = async(req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        res.render("editReview", {review})
    } catch (err) {
        console.error(err);
        res.send("Error loading edit form");
    }
};

// post: edit existing review
exports.editReview = async (req, res) => {
    const { comment, rating } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        // check if review exists before proceeding
        if (!review) {
            return res.send("Review not found");
        }

        const movieId = review.movie;

        // ... rest of the validation code ...
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { comment, rating: Number(rating) },
            { new: true }
        );

        // update the movie's rating average
        await updateMovieAverage(updatedReview.movie);

        res.redirect(req.get("referer") || "/myReviews");

    } catch (err) {
        console.log(err);
        res.send("Error updating review");
    }
};

// post: delete review
exports.deleteReview = async(req, res) => {

    try{
        const review = await Review.findByIdAndDelete(req.params.id)

        if (review) {
            // recalculate average for this movie
            await updateMovieAverage(review.movie);
        }
            res.redirect(req.get("referer") || "/myReviews");  
    }catch(err){
        console.log(err)
        res.send("Error deleting review")
    }
};
