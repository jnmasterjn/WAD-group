// middleware to protect routes

// Check if user is logged in
function isLoggedIn(req, res, next) {
    // If no userId in session → user not logged in
    if (!req.session.userId){
        console.log("user is not logged in")
        return res.redirect("/login")
    }
    next(); //next is a func provided by express, it means "go run the next thing in line"
            //move to the controller func
}

// Check if user is admin
function isAdmin(req, res, next) {
    if (!req.session.isAdmin === true) {
        return res.status(403).send("Admins only.");
    }

    // User is admin → continue
    next();
}

// Export middleware
module.exports = { isLoggedIn, isAdmin };
