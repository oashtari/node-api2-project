const express = require('express');

const Hubs = require("./db");

// upper case R
const router = express.Router(); // invoke router

//router handles endpoints that begin with /api/posts
// router only cares about what after /api/posts

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


router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const { text } = req.body;

    if (text) {
        Hubs.findById(id)
            .then(post => {
                if (post) {
                    Hubs.insertComment({ text: text, post_id: id })
                        .then(() => {
                            res.status(201)
                                .json(text)
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


//FIX THIS  -- JUST ADDED FIND POST COMMENTS METHOD
router.get('/:id/comments', (req, res) => {
    Hubs.findPostComments(req.params.id)
        .then(hub => {
            if (hub) {
                res.status(200).json(hub)
            } else if (!hub) {
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500)
                .json({ error: "The comments information could not be retrived." })
        })
})


router.post("/:id/comments", (req, res) => {

});

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



router.put("/:id", (req, res) => {
    const { id } = req.params;

    const changes = req.body;
    console.log(changes);


    // if (!changes.title || !changes.contents) {
    //     res.status(400)
    //         .json({ message: "Please provide title and contents for the post." })
    // } else {
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

    // Hubs.findById(id)
    //     .then(post => {
    //         console.log('is this the right post', post)
    //         if (changes) {
    //             Hubs.udpate(id, changes)
    //                 .then(() => {
    //                     res.status(200)
    //                         .json(post)
    //                 })
    //                 .catch(error => {
    //                     res.status(500)
    //                         .json({ error: "The post information could not be modified." })
    //                 })
    //         } else {
    //             res.status(404)
    //                 .json({ message: "The post with the specified ID does not exist." })
    //         }
    //     })
})


// server.put('/api/users/:id', (req, res) => {

//     const { id } = req.params;

//     const changes = req.body;
//     let index = users.findIndex(user => JSON.stringify(user.id) === JSON.stringify(id));

//     if (!changes.name || !changes.bio) {
//         res
//             .status(400)
//             .json({ message: 'Please provide name and bio for the user.' })
//     } else if (index === -1) {
//         res
//             .status(404)
//             .json({ message: "The user with the specified ID does not exist." })
//     } else if (index !== -1) {
//         users[index] = changes;
//         res
//             .status(200)
//             .json(users[index]);
//     } else {
//         res
//             .status(500)
//             .json({ message: "The user information could not be modified." })
//     }
// })



module.exports = router;