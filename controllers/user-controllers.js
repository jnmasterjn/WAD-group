const bcrypt = require("bcrypt");
const User = require("../models/user");

//register logic
exports.registerLogic = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render("register", { error: "All fields are required" });
    }
    //password must > 6
    if (password && password.length < 6) {
        return res.render("register", { error: "Password must be at least 6 characters" });
    }

    try {
        //check if username appear in db alr or not
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("register", { error: "Username already exists" })
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashed
        });

        await user.save();

        res.redirect("/login");

    } catch (err) {
        console.log(err)
        res.render("register", { error: "Something went wrong, please try again." });
    }
};

// login logic
exports.loginLogic = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.render("login", { error: "User not found" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.render("login", { error: "Password does not match" })
        }

        //session
        req.session.userId = user._id;
        req.session.username = user.username;

        res.redirect("/movie")

    } catch (err) {
        console.log(err)
        res.render("login", { error: "Something went wrong, please try again." })
    }
};

// profile
exports.profile = async(req, res) => {
    const user = await User.findById(req.session.userId);
    res.render("profile", { user })
};