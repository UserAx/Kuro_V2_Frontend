const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket= require("socket.io");
const io = socket(server);
io.origins("*:*");
const PORT = 3001;
const path = require('path');
// const cors = require('cors');
// app.use(cors());

const publicDirectory = path.join(__dirname, '..', 'public');

app.enable('trust proxy');
const redirectToHttps = function(req, res, next) {
    if(process.env.NODE_ENV !== 'development' && !req.secure) {
        return res.redirect("https://" + req.headers.host + req.url());
    }
    next();
}

app.use(express.static(publicDirectory));
app.use(express.json());
app.use(redirectToHttps);

const users = [];

io.on("connection", (socket) => {
    socket.on("join", ({username, _id}, callback) => {
        const exits = users.findIndex((user) => user.userId === _id);
        if(exits >= 0){//-1 if not present. So, by that 
            users.splice(exits, 1);
        }
        users.push({socketId: socket.id, username, userId: _id});
        socket.join(_id);
        // console.log("After splice:", users);
        // console.log("Before splice", users);
        // console.log("Final array:", users);
        // console.log(_id, username);
    });

    socket.on("sendMessage", (message, callback) => {
        io.to(...message.receivers).emit("message" ,message);
        const {username} = users.find((user) => user.userId === message.sender);
        io.to(...message.receivers).emit("messageAlert", {senderId: message.sender});
    });

    socket.on("sendFriendRequest", (request, callback) => {
        io.to(request.receiverId).emit("request", request);
    });

    socket.on("disconnect", () => {
        console.log("Existing users: ", users);
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
});

server.listen(process.env.PORT || PORT, () => {
    console.log("server is up on"); 
});