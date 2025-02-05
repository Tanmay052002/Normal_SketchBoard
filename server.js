const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files like HTML, JS, CSS

io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for drawing data from the client
    socket.on('draw', (data) => {
        // Broadcast drawing data to all connected clients
        socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
