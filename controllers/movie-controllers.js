const Movie = require("../models/movie");
const User = require("../models/user");
const Review = require("../models/review");
const Watchedlist = require("../models/watchedlist");
const Watchlist = require("../models/watchlist");
const Like = require("../models/like");

// Helper function for add movies function below

function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
}

function similarityPercent(a, b) {
    a = normalizeText(a);
    b = normalizeText(b);

    let matches = 0;
    let minLength = Math.min(a.length, b.length);
    let maxLength = Math.max(a.length, b.length);

    if (maxLength === 0) {
        return 100;
    }

    for (let i = 0; i < minLength; i++) {
        if (a[i] === b[i]) {
            matches++;
        }
    }

    return Number(((matches / maxLength) * 100).toFixed(2));
}

function checkTitleWarnings(newTitle, movies) {
    let warnings = [];

    for (let i = 0; i < movies.length; i++) {
        let oldTitle = movies[i].title;
        let percent = similarityPercent(newTitle, oldTitle);

        if (percent >= 80 && percent < 100) {
            warnings.push(
                `Warning: ${newTitle}" is ${percent} % similar to existing movie title "${oldTitle}.`
            )
        }
    }

    return warnings;
}

// Controller function to load the individual movie (like when you click on a movie it brings you to the page where you can see it's description and everything, uses ID in searchbar)
exports.movieDesc = async (req, res) => {
    try {
        //req.params = values from the URL
        const ind_movie = await Movie.findById(req.params.id);
        const user = await User.findById(req.session.userId);
        const watchedlist = await Watchedlist.findOne({ user: user })
        const watchlist = await Watchlist.findOne({ user: user })

        const reviews = await Review.find({
            movie: req.params.id
        }).populate("user"); // optional (to show username)

        //find is only finding one thing
        const userReview = reviews.find(r => {
            return r.user && r.user._id.toString() === req.session.userId.toString()
        })

        //filter find all the matches
        const otherReview = reviews.filter(r => {
            return r.user && r.user._id.toString() !== req.session.userId.toString()
        })

        //get all the likes for reviews
        const likes = await Like.find({
            review: { $in: reviews.map(r => r._id.toString()) }
        })

        //count likes per review
        const likeMap = {};
        const userLikedMap = {};

        likes.forEach(like => {
            const reviewId = like.review.toString();

            likeMap[reviewId] = (likeMap[reviewId] || 0) + 1;

            //check if current user liked
            if (like.user.toString() === req.session.userId.toString()) {
                userLikedMap[reviewId] = true;
            }
        });

        //Recently view
        if (!req.session.recentlyViewed) {
            req.session.recentlyViewed = [];
        }

        const currentMovieId = ind_movie._id.toString();

        // remove duplicate
        const updatedList = req.session.recentlyViewed.filter(function (id) {
            return id.toString() !== currentMovieId;
        });

        req.session.recentlyViewed = updatedList;

        // add to front
        req.session.recentlyViewed.unshift(currentMovieId);

        // limit 5
        req.session.recentlyViewed = req.session.recentlyViewed.slice(0, 10);

        //some --> check if ANY item matches
        //toString() --> mongo object is different from string
        const isInWatchlist = watchlist ? watchlist.movies.some(id =>
            id.toString() === ind_movie._id.toString()
        ) : false;

        const isInWatchedMovies = watchedlist ? watchedlist.movies.some(id =>
            id.toString() === ind_movie._id.toString()
        ) : false;

        res.render("movies/movieDetail", {
            ind_movie,
            isInWatchlist,
            isInWatchedMovies,
            reviews: otherReview || [],
            userReview,
            likeMap,
            userLikedMap
        })
    } catch (error) {
        console.error(error);
        res.send("Failed to display movie")
    }
};

// Controller function to load all movies on the website
exports.displayMovies = async (req, res) => {
    try {
        const watchedlist = await Watchedlist.findOne({ user: req.session.userId });
        const watchedMoviesList = watchedlist ? watchedlist.movies.map(id => id.toString()) : [];

        // get selected genre from URL (?genre=Action)
        const genre = req.query.genre;

        //get all unique from db (for dropdown)
        let genres = await Movie.distinct('genre')

        let movies; //define movie first

        //if user select a genre --> show movies of that genre, else: show all movie
        if (genre) {
            movies = await Movie.find({ genre: genre });
        } else {
            movies = await Movie.find()
        }
        res.render("movies/movieList", {
            movies, //movie list
            genres, //dropdown options
            selectedGenre: genre, //whatever the user selected
            watchedMoviesList,
            isAdmin: req.session.isAdmin || false
        })

    } catch (error) {
        console.error(error);
        res.send("Failed to display movies")
    }

};
// function to add movie
exports.movieAdd = async (req, res) => {
    try {
        const { title, description, releaseYear, genre, image, confirmWarning } = req.body;

        const errors = [];
        let warnings = [];

        if (title && title.trim().length > 50) {
            errors.push("Title must not exceed 50 characters.");
        }

        if (!releaseYear || !/^\d{4}$/.test(String(releaseYear).trim())) {
            errors.push("Release year must be exactly 4 digits.");
        }

        const validImageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (!image || !validImageExtensions.test(image)) {
            errors.push("Image URL must end with a valid image format (jpg, jpeg, png, gif, webp).");
        }

        if (description && description.trim().length > 3000) {
            errors.push("Description must not exceed 3000 characters.");
        }

        if (genre && genre.trim().length > 20) {
            errors.push("Genre must not exceed 20 characters.");
        }

        const existingMovie = await Movie.findOne({ title, genre, releaseYear });
        if (existingMovie) {
            errors.push("Movie with this title, genre, and release year already exists.");
        }

        const allMovies = await Movie.find({}, "title");
        warnings = checkTitleWarnings(title, allMovies);

        if (errors.length > 0) {
            return res.render("movies/addMovie", {
                movie: { title, description, releaseYear, genre, image },
                error: errors,
                warnings,
                success: null
            });
        }

        if (warnings.length > 0 && confirmWarning !== "true") {
            return res.render("movies/addMovie", {
                movie: { title, description, releaseYear, genre, image },
                error: [],
                warnings,
                success: null
            });
        }

        const newMovie = new Movie({
            title,
            description,
            genre,
            releaseYear,
            image
        });

        await newMovie.save();

        return res.redirect("/movie");
    } catch (error) {
        console.error("=== movieAdd error ===");
        console.error(error);
        console.error("message:", error.message);
        console.error("stack:", error.stack);

        return res.render("movies/addMovie", {
            movie: req.body,
            error: [error.message],
            warnings: [],
            success: null
        });
    }
};

// function to remove movie
exports.movieRemove = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.redirect("/movie");
    } catch (error) {
        console.log(error);
        res.send("Error deleting movie.");
    }
};

// function to edit
exports.movieEdit = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        res.render("movies/editMovie", {
            movie,
            error: [],
            warnings: [],
            success: null
        });
    } catch (error) {
        console.log(error);
        res.send("Error loading edit page.");
    }
};

// handle submitted edit form
exports.movieUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        let { title, description, genre, releaseYear, image } = req.body;

        const errors = [];
        const warnings = [];

        // Trim inputs
        title = title?.trim();
        description = description?.trim();
        genre = genre?.trim();
        releaseYear = releaseYear?.trim();
        image = image?.trim();

        if (!title || !description || !genre || !releaseYear) {
            errors.push("Please fill in all required fields.");
        }

        if (title && title.length > 50) {
            errors.push("Title must not exceed 50 characters.");
        }

        if (releaseYear && !/^\d{4}$/.test(releaseYear)) {
            errors.push("Release year must be exactly 4 digits.");
        }

        const validImageExtensions = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
        if (image && !validImageExtensions.test(image)) {
            errors.push("Image URL must end with a valid image format (jpg, jpeg, png, gif, webp).");
        }

        if (description && description.length > 3000) {
            errors.push("Description must not exceed 3000 characters.");
        }

        if (genre && genre.length > 20) {
            errors.push("Genre must not exceed 20 characters.");
        }

        // Exact duplicate check, excluding current movie
        if (title && genre && releaseYear) {
            const existingMovie = await Movie.findOne({
                _id: { $ne: id },
                title,
                genre,
                releaseYear
            });

            if (existingMovie) {
                errors.push("Movie with same title, genre and year already exists.");
            }
        }

        // Similar title warnings, excluding current movie
        const movies = await Movie.find({ _id: { $ne: id } });
        warnings.push(...checkTitleWarnings(title, movies));

        // show errors first
        if (errors.length > 0) {
            return res.render("movies/editMovie", {
                movie: { _id: id, title, description, genre, releaseYear, image },
                error: errors,
                warnings,
                success: null
            });
        }

        // Show warnings only on first submit
        if (warnings.length > 0 && confirmWarning !== "true") {
            return res.render("movies/editMovie", {
                movie: { _id: id, title, description, genre, releaseYear, image },
                error: [],
                warnings,
                success: null
            });
        }

        const updateData = {
            title,
            description,
            genre,
            releaseYear,
            image
        };

        await Movie.findByIdAndUpdate(id, updateData, {
            runValidators: true,
            new: true
        });

        return res.redirect("/movie");
    } catch (error) {
    console.error("Full error:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return res.render("movies/editMovie", {
        movie: { _id: req.params.id, ...req.body },
        error: [error.message || "Error updating movie."],
        warnings: [],
        success: null
        });
    }
};