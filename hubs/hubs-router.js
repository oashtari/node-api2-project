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

router.get('/:id/comments', (req, res) => {
    Hubs.findById(req.params.id)
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

});

// router.put("/api/posts", (req, res)=>{
// });
// router.put("/api/posts", (req, res)=>{
// });

module.exports = router;



// GET to api/users

// server.get('/api/users', (req, res) => {
//     if (req.body) {
//         res
//             .status(200)
//             .json(users)
//     } else {
//         res
//             .status(500)
//             .json({ message: "The users information could not be retrieved." })
//     }
// })


// GET to api/user/:id



// DELETE

// server.delete('/api/users/:id', (req, res) => {
//     const { id } = req.params;

//     const deleted = users.find(user => JSON.stringify(user.id) === `${id}`)

//     if (deleted) {
//         users = users.filter(user => user.id !== id)

//         res
//             .status(200)
//             .json(deleted)

//     } else if (!deleted) {
//         res
//             .status(404)
//             .json({ message: "The user with the specified ID does not exist." })
//     } else {
//         res
//             .status(500)
//             .json({ message: "The user could not be removed." })
//     }
// })

// PUT

// server.put('/api/users/:id', (req, res) => {

//     const { id } = req.params;

//     const changes = req.body;

//     console.log('changes:', changes)
//     console.log('id', id)

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
