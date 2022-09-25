const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");

//Create a Post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Update a Post
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        try {
            await Post.updateOne({ $set: req.body });
            res.status(200).json("post has been updated");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can update only your post");
    }
});

//delete a Post
router.delete("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        try {
            await Post.deleteOne();
            res.status(200).json("post has been deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can delete only your post");
    }
});

//like a Post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a Post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline Post
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPost = await Post.find({ userId: currentUser._id });
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPost.concat(...friendPost));
    } catch (err) {
        res.status(500).json(err);
    }
});

//get User all Post
router.get("/profile/:userId", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;