const Movie = require("../models/movie");
const User = require("../models/user");
const Review = require("../models/review");
const Watchedlist = require("../models/watchedlist");
const Watchlist = require("../models/watchlist");
const Like = require("../models/like");

exports.toggleLike = async(req, res) => {
    try{
        const userId = req.session.userId
        const reviewId = req.params.id;

        //checking if user alr liked
        const existingLike = await Like.findOne({
            user:userId,
            review:reviewId
        })

        if (existingLike){
            //delete ONE document from Like collection
            await Like.deleteOne({ _id: existingLike._id });
        }else {
            await Like.create({
                user:userId,
                review:reviewId
            })
        }

        const back = req.get("referer") || "/movie";
        res.redirect(back)

    }catch(err){
        console.log(err)
        res.send("error liking comment")
    }
}
