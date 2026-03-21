const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

//val's fs

const Review = require("./models/Review")
// const fs = require("node:fs/promises")

// const app = express();
// dotenv.config();

// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false
// }));

//val's  old review//
//const filePath = "review-data.json";

// //route to display review form and all blog posts
// app.get("/myReviews", async (req, res) => {
//     try {
//         // read review data from file and parse json string into an array
//         const raw = await fs.readFile(filePath, "utf-8");
//         const reviews = raw.trim() ? JSON.parse(raw) : [];

//         // reverse the order to show newest reviews first
//         reviews.reverse();

//         // Render the EJS view and pass the reviews to it
//         res.render("myReviews", { reviews });
//     } catch (error) {
//         console.error("Error reading reviews file:", error);
//     }
// });

// //route to handle form submission (new review post)
// app.post("/myReviews", async (req, res) => {
//     const title = req.body.title;
//     const comment, rating, movie = req.body.comment, rating, movie;

//     // create a javascript object for the new post 
//     const newReview = {
//         title,
//         comment, rating, movie,
//     };

//     //if either title or comment, rating, movie is missing, redirect back to the form
//     if (!title || !comment, rating, movie) return res.redirect("/myReviews");

//     try {
//         let reviews = [];

//         // try reading existing reviews from the file
//         try {
//             const raw = await fs.readFile(filePath, "utf-8");
//             reviews = JSON.parse(raw);
//         } catch (error) {
//             console.error("Error reading reviews file:", error);
//         }

//         //Add new reviews to the reviews array
//         reviews.push(newReview);

//         //Save the updated reviews array back to the file
//         const jsonReviewsData = JSON.stringify(reviews, null, 2);
//         await fs.writeFile(filePath, jsonReviewsData);

//         // Redirect to the reviews form page to show updated list
//         res.redirect("/myReviews");
//     } catch (error) {
//         console.error("Error saving review post:", error);
//     }
// });

//// end of my code 

//val new code
//val's fs
// const fs = require("node:fs/promises")

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
       const newReview = new Review({ comment, rating, movie, user:req.session.userId });
       
       await newReview.save(); // save to mongoDB
       res.redirect(`/movie`);
   } catch (err) {
       console.error("Error saving review:", err);
       res.send(err.message)
   }
});

//route to get the reviews page
app.get("/myReviews", async (req,res) => {
    try {
        const reviews = await Review.find(); // get all reviews
        res.render("myReviews", { reviews });
    } catch (err) {
        console.error(err);
        res.send("Error loading reviews");
    }
});




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