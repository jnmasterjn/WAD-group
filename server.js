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

//store username all pages
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    next();
});

//routes 
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

const movieRoutes = require("./routes/movieRoute");
app.use("/", movieRoutes);

const watchlistRoutes = require("./routes/watchlistRoutes");
app.use("/", watchlistRoutes);

const reviewRoutes = require("./routes/reviewRoute");
app.use("/", reviewRoutes)

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