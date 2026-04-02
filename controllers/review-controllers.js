const Movie = require("../models/movie");
const Review = require("../models/review");
const { movieEdit } = require("./movie-controllers");

// Helper function to recalculate movie average
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


// Save review
exports.postReview = async (req, res) => {
    // redirect to login if session is invalid or expired
    if (!req.session.userId) return res.redirect("/login");

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
        // get all reviews
        // user and movie come from movie review schema
        // populate = convert ID -> full object from another collection
        const reviews = await Review.find({ user: req.session.userId }).populate("user").populate("movie");

        // filter out reviews whose movie has been deleted
        const validReviews = reviews.filter(review => review.movie !== null);

        res.render("myReviews", { reviews: validReviews });
    } catch (err) {
        console.error(err);
        res.send("Error loading reviews");
    }
};

// Show form to create a new review
// exports.viewNewReview = async (req, res) => {
//     try {
//         const movieId = req.params.movieId;
//         const movie = await Movie.findById(movieId);

//         const existingReview = await Review.findOne({ user: req.session.userId, movie: movieId });
//         if (existingReview) {
//             return res.redirect(`/movie/${movieId}`); // already reviewed
//         }
//         res.render("newReview", { movie });
//     } catch (err) {
//         console.error(err);
//         res.send("You already made a review. One review allowed only.")
//     }
// };

// Show form to edit existing review
exports.viewEditReview = async(req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        res.render("editReview", {review})
    } catch (err) {
        console.error(err);
        res.send("Error loading edit form");
    }
};

// Edit existing review
exports.editReview = async (req, res) => {
    const { comment, rating } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        // check if review exists before proceeding
        if (!review) {
            return res.send("Review not found");
        }

        //trimm the new comment
        const trimmedComment = comment.trim();

        if (!trimmedComment) {
            return res.send("Comment cannot be empty");
        }

        if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            return res.send("Rating must be between 1 and 5");
        }


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

// Delete review
exports.deleteReview = async(req, res) => {

    try{
        const review = await Review.findByIdAndDelete(req.params.id)

        if (review) {
            // recalculate average for this movie
            await updateMovieAverage(review.movie);

            res.redirect(req.get("referer") || "/myReviews");
        }        
    }catch(err){
        console.log(err)
        res.send("Error deleting review")
    }
};
