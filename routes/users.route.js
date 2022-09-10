const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//update user details
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err);
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Updated Successfully");
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can update only your account");
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted Successfully");
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can delete only your account");
    }
})

//get User details
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const { password, createdAt, updatedAt, isAdmin, ...others } = user._doc
            res.status(200).json(others);
        }
        else {
            res.status(404).json("user not found");
        }

    } catch (err) {
        return res.status(500).json(err);
    }
})
module.exports = router