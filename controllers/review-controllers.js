const Movie = require("../models/movie");
const Review = require("../models/review");

// Helper function to recalculate movie's average rating and ratings count
async function updateMovieAverage(movieId) {
    // fetch all reviews for this movie
    const allReviews = await Review.find({ movie: movieId });
    // filter out reviews that do not have a rating
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

// Send/Post a review
exports.postReview = async (req, res) => {
    // redirect to login if session is invalid or expired
    if (!req.session.userId) return res.redirect("/login");

    const { comment, rating, movie } = req.body;

    try {
        // fetch data for rendering the page
        const ind_movie = await Movie.findById(movie);
        const reviews = await Review.find({ movie });
        const userReview = await Review.findOne({ movie, user: req.session.userId });

        // default values required for template
        const likeMap = {};
        const userLikedMap = {};
        const isInWatchlist = false; 
        const isInWatchedMovies = false;

        // Validation: comment cannot be empty
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

    // create and save new review 
    const newReview = new Review({
        comment, 
        rating: rating ? Number(rating) : undefined, 
        movie,
        user: req.session.userId,
        username: req.session.username
    });

    await newReview.save();

    // update the movie's rating average and ratings count
    await updateMovieAverage(movie);

    // redirect back to movie page
    res.redirect(`/movie/${movie}`);

    } catch (err) {
        console.log("Error saving review:", err);
        res.send("Error saving your review");
    }
};

// Show all reviews by user
exports.viewMyReviews = async (req, res) => {
    try {
        // get all reviews by the logged-in user
        // populate converts referenced IDs into full documents
        const reviews = await Review.find({ user: req.session.userId }).populate("user").populate("movie");

        // filter out reviews whose movie has been deleted
        const validReviews = reviews.filter(review => review.movie !== null);

        res.render("myReviews", { reviews: validReviews, error: null });
    } catch (err) {
        console.error(err);
        res.send("Error loading reviews");
    }
};

// Edit existing review
exports.editReview = async (req, res) => {
    const { comment, rating } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        // check if review exists before proceeding
        if (!review) return res.send("Review not found");

        // remove whitespace from the beginning and end of the comment
        const trimmedComment = comment.trim();

        // validate comment is not empty
        if (!trimmedComment) {
            const reviews = await Review.find({ user: req.session.userId }).populate("user").populate("movie");
            const validReviews = reviews.filter(review => review.movie !== null);
            return res.render("myReviews", {
                reviews: validReviews,
                error: "Comment cannot be empty"
            });
        }

        // validate rating is between 1 and 5
        if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            const reviews = await Review.find({ user: req.session.userId }).populate("user").populate("movie");
            const validReviews = reviews.filter(review => review.movie !== null);
            return res.render("myReviews", {
                reviews: validReviews,
                error: "Rating must be between 1 and 5"
            });
        }

        // update the review with new comment and/or rating
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { comment, rating: Number(rating) },
            { new: true }
        );

        // update the movie's rating average and ratings count
        await updateMovieAverage(updatedReview.movie);

        res.redirect(req.get("referer") || "/myReviews");

    } catch (err) {
        console.log(err);
        res.send("Error updating review");
    }
};

// Delete review
exports.deleteReview = async(req, res) => {

    try{
        const review = await Review.findByIdAndDelete(req.params.id)

        if (review) {
            // update the movie's rating average and ratings count
            await updateMovieAverage(review.movie);
        }        
        res.redirect(req.get("referer") || "/myReviews");
    }catch(err){
        console.log(err)
        res.send("Error deleting review")
    }
};
