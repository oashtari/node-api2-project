const express = require('express');

const Hubs = require("./db");

// upper case R
const router = express.Router(); // invoke router

//router handles endpoints that begin with /api/posts
// router only cares about what after /api/posts

router.post("/", (req, res) => {
    const post = req.body;
    // console.log('the post content', post)

    if (!post.title || !post.contents) {
        res.status(400)
            .json({ errorMessage: "Please provide title and contents for the post." })
    } else if (post) {
        console.log('yes post content', post)
        Hubs.insert(post)
            .then(post => {
                res.status(201)
                    .json(post)
            })
    } else {
        res.status(500)
            .json({ error: "There was an error while saving the post to the database." })
    }



});

router.post("/:id/comments", (req, res) => {
    if (req.body) {
        res.status(200)
            .json(posts)
    } else {
        res.status(500)
            .json({ error: "The posts information could not be retrieved." })
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

router.get("/:id", (req, res) => {
    const post = posts.find(post => post.id === req.params.id)

    if (post) {
        res.status(200)
            .json(posts)
    } else if (!post) {
        res.status(404)
            .json({ message: "The post with specified ID does not exist." })
    } else {
        res.status(500)
            .json({ error: "The posts information could not be retrieved." })
    }
});

// server.get('/api/users/:id', (req, res) => {
//     const user = users.find(user => user.id === req.params.id);

//     if (user) {
//         res
//             .status(200)
//             .json(user)
//     } else if (!user) {
//         res
//             .status(404)
//             .json({ message: "The user with the specified ID does not exist." })
//     } else {
//         res
//             .status(500)
//             .json({ message: "The user information could not be retrieved." })
//     }
// })



router.post("/:id/comments", (req, res) => {

});

router.delete("/:id", (req, res) => {

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
