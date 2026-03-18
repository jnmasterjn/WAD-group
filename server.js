const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

app.get("/", (req, res) => {
    res.send("Hello Guys This is for TESTING ONLY.");
});

app.listen(3000, () => {
    console.log("---Server running on port 3000---");
});