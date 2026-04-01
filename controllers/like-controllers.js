const Like = require("../models/like");

// Controller for the like function
exports.toggleLike = async(req, res) => {
    try{
        // retrieve the user id from the session and the review id from the url
        const userId = req.session.userId
        const reviewId = req.params.id;

        // checking if user already liked
        const existingLike = await Like.findOne({
            user:userId,
            review:reviewId
        })

        if (existingLike){
            //delete ONE document from Like collection
            await Like.deleteOne({ _id: existingLike._id });
        }else {
            // otherwise create a new like document in the Like collection
            await Like.create({
                user:userId,
                review:reviewId
            })
        }

        // redirect back to the previous page
        const back = req.get("referer") || "/movie";
        res.redirect(back)

    }catch(err){
        console.log(err)
        res.send("error liking comment")
    }
}
