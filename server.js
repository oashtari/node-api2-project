const express = require('express');

const hubsRouter = require("./hubs/hubs-router");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h2>npi project 2</h>
    `);
})

// most crucial part
// the router handles that begni with /api/posts

server.use(`/api/posts`, hubsRouter);

module.exports = server;