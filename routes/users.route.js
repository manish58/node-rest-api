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
                $set: req.body,
            });
            res.status(200).json("Updated Successfully");
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can update only your account");
    }
});

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
});

//get User details
router.get("/", async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ userName: username });
        if (user) {
            const { password, createdAt, updatedAt, isAdmin, ...others } = user._doc;
            res.status(200).json(others);
        } else {
            res.status(404).json("user not found");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Follow User
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.id)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You already follow this user");
            }
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You cannot follow yourself");
    }
})


//UnFollow User
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("User has been Unfollowed");
            } else {
                res.status(403).json("you dont follow this user")
            }
        } catch {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You cannot unfollow yourself");
    }
})
module.exports = router;
