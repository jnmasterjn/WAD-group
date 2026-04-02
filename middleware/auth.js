// middleware to protect routes

function isLoggedIn(req, res, next) {
    if (!req.session.userId){
        console.log("user is not logged in")
        return res.redirect("/login")
    }
    next(); //next is a func provided by express, it means "go run the next thing in line"
            //move to the controller func
}

function isAdmin(req, res, next) {
    if (!req.session.isAdmin === true) {
        return res.status(403).send("Admins only.");
    }
    next();
}

module.exports = { isLoggedIn, isAdmin };
