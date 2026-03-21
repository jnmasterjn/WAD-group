const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

//val's fs

const Review = require("./models/review")
const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

//route to handle form submission (new review post)
app.post("/myReviews", async (req, res) => {
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
});

//route to get the reviews page
app.get("/myReviews", async (req,res) => {
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
});

//route the get all reviews for one Movie


const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

const movieRoutes = require("./routes/movieRoute");
app.use("/", movieRoutes);

const watchlistRoutes = require("./routes/watchlistRoutes");
app.use("/", watchlistRoutes);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

function startServer() {
    const hostname = "localhost"; // Define server hostname
    const port = 3000;// Define port number

    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`)
    });
}

// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);