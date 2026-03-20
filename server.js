const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log(err));

const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

const movieRoutes = require("./routes/movieRoute");
app.use("/", movieRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));