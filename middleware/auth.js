// middleware to protect routes

function isLoggedIn(req, res, next) {
    if (!req.session.userId){
        return res.redirect("/login")
    }
    next(); //next is a func provided by express, it means "go run the next thing in line"
}

module.exports = isLoggedIn;