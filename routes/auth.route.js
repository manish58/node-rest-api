const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//Register new User
router.post("/register", async (req, res) => {

    try {
        //generate hashed Password
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);
        //create new user
        const user = await new User({
            userName: req.body.userName,
            email: req.body.email,
            password: encryptedPassword,
            salt: salt
        })
        const newUser = await user.save();
        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("User not Found");
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Invalid UserName or Password");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router