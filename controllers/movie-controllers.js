const Movie = require("../models/movie");
const User = require("../models/user");

// Controller function to load all movies on the website
exports.displayMovies = async (req, res) => { 
    try {

        // get selected genre from URL (?genre=Action)
        const genre = req.query.genre;

        //get all unique from db (for dropdown)
        let genres = await Movie.distinct('genre')

        let movies; //define movie first

        //if user select a genre --> show movies of that genre, else: show all movie
        if (genre){
            movies = await Movie.find({genre:genre});
        }else{
            movies = await Movie.find()
        }
        res.render("movies/movieList", {
            movies, //movie list
            genres, //dropdown options
            selectedGenre:genre //whatever the user selected
        })

    } catch (error) {
        console.error(error);
        res.send("Failed to display movies")
    }
    
};

// Controller function to load the individual movie (like when you click on a movie it brings you to the page where you can see it's description and everything, uses ID in searchbar)
exports.movieDesc = async (req, res) => {

    //req.params = values from the URL
    const ind_movie = await Movie.findById(req.params.id);
    const user = await User.findById(req.session.userId);

    
    //Recently view

    if (!req.session.recentlyViewed) {
        req.session.recentlyViewed = [];
    }

    const currentMovieId = ind_movie._id.toString();

    // remove duplicate
    const updatedList = req.session.recentlyViewed.filter(function(id) {
        return id.toString() !== currentMovieId;
    });

    req.session.recentlyViewed = updatedList;

    // add to front
    req.session.recentlyViewed.unshift(currentMovieId);

    // limit 5
    req.session.recentlyViewed = req.session.recentlyViewed.slice(0, 5);

    //some --> check if ANY item matches
    //toString() --> mongo object is different from string
    const isInWatchlist = user.watchlist.some(id =>
        id.toString() === ind_movie._id.toString()
    );

    res.render("movies/movieDetail", {ind_movie, isInWatchlist})
    console.log(req.session.recentlyViewed);
};