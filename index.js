const server = require('./server');

const PORT = 5500;
server.listen(PORT, () => {
    console.log(`the server is listening on port:${PORT}`)
})