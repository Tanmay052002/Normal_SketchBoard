const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let undoStack = []; // To keep track of drawing points for all users

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// On new client connection
io.on("connection", (socket) => {
    console.log("A user connected");

    // Send the current undo stack (drawing state) to the new client
    socket.emit("initialize", undoStack);

    // Handle mousedown event (start drawing)
    socket.on("mousedown", (point) => {
        undoStack.push(point); // Save the point for undo
        socket.broadcast.emit("mousedown", point); // Broadcast to other clients
    });

    // Handle mousemove event (drawing in progress)
    socket.on("mousemove", (point) => {
        undoStack.push(point); // Save the point for undo
        socket.broadcast.emit("mousemove", point); // Broadcast to other clients
    });

    // Handle undo event
    socket.on("undo", () => {
        if (undoStack.length > 0) {
            undoStack.pop(); // Remove the last drawing point for undo
            io.emit("undo"); // Broadcast undo action to all clients
        }
    });

    // Handle redo event (implement similar to undo if necessary)
    socket.on("redo", () => {
        // Add redo functionality if needed
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
