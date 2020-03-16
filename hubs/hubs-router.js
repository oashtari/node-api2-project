const express = require('express');

const Hubs = require("./db");

// upper case R
const router = express.Router(); // invoke router

//router handles endpoints that begin with /api/posts
// router only cares about what after /api/posts

// ADD POST
router.post("/", (req, res) => {
    const { title, contents } = req.body;
    // console.log('the post content', post)

    if (!title || !contents) {
        res.status(400)
            .json({ errorMessage: "Please provide title and contents for the post." })
    } else if (title && contents) {
        Hubs.insert({ title: title, contents: contents })
            .then(postID => {
                Hubs.findById(postID.id)
                    .then(post =>
                        res.status(201)
                            .json(post)
                    )
            })
    } else {
        res.status(500)
            .json({ error: "There was an error while saving the post to the database." })
    }
});

// ADD COMMENTS
router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const { text } = req.body;

    if (text) {
        Hubs.findById(id)
            .then(post => {
                if (post.length > 0) {
                    Hubs.insertComment({ text: text, post_id: id })
                        .then(() => {
                            res.status(201)
                                .json({ post, text, message: "comment added " })
                        })
                        .catch(error => {
                            res.status(500)
                                .json({ message: "There was an error while saving the comment to the database." })
                        })
                } else {
                    res.status(404)
                        .json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                res.status(500)
                    .json({ error: "Post could not be retrived." })
            })
    } else {
        res.status(400)
            .json({ message: "Please provide text for the comment." })
    }

});

// GET POSTS
router.get("/", (req, res) => {
    Hubs.find()
        .then(posts => {
            if (posts) {
                res.status(200)
                    .json(posts)
            } else {
                res.status(500)
                    .json({ error: "The posts information could not be retrieved." })
            }
        })
});

// GET POSTS BY ID
router.get('/:id', (req, res) => {
    Hubs.findById(req.params.id)
        .then(hub => {
            if (hub) {
                res.status(200).json(hub);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hubs',
            });
        });
});


// GET COMMENTS
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;

    Hubs.findCommentById(id)
        .then(post => {
            if (post) {
                Hubs.findCommentById(id)
                    .then(comment => {
                        if (comment) {
                            res.status(200)
                                .json(post)
                        } else {
                            res.status(404)
                                .json({ message: "There are no comments for this post." })
                        }
                    })
                    .catch(error => {
                        res.status(500)
                            .json({ error: "The comments information could not be retrived." })
                    })
            } else {
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500)
                .json({ error: "The post information could not be retrived." })
        })
})

// DELETE
router.delete("/:id", (req, res) => {
    Hubs.remove(req.params.id)
        .then(post => {
            if (post) {
                res.status(200)
                    .json({ message: "that post is GONE" })
            } else {
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500)
                .json({ error: "The post could not be removed." })
        })

});


// PUT
router.put("/:id", (req, res) => {
    const { id } = req.params;

    const changes = req.body;
    console.log(changes);

    if (changes.title && changes.contents) {
        Hubs.update(id, changes)
            .then(result => {
                if (result) {
                    Hubs.findById(id)
                        .then(post => {
                            res.status(200)
                                .json(post)
                        })
                        .catch(error => {
                            res.status(500)
                                .json({ error: "The post information could not be modified." })
                        })
                } else {
                    res.status(404)
                        .json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                res.status(400)
                    .json({ message: "Please provide title and contents for the post." })
            })
    }
})

module.exports = router;