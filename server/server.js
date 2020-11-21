const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// const https = require('https');
// const server = https.createServer(app);
const socket = require("socket.io");
const io = socket(server);
io.origins("*:*");
const PORT = 3001;
const path = require('path');

//Note: HTTPS only available after you purchase a ssl certificate.
//Using Express-sslify:
// const enforce = require('express-sslify');
// app.use(enforce.HTTPS({ trustProtoHeader: true }));
//Using SSLRedirect
// const sslRedirect = require('heroku-ssl-redirect');
// const cors = require('cors');
// app.use(cors());

const publicDirectory = path.join(__dirname, '..', 'public');

//for something outside heroku server.
// const redirectToHttps = function (req, res, next) {
//     if(process.env.NODE_ENV !== 'development' && !req.secure) {
//         return res.redirect("https://" + req.headers.host + req.url());
//     }
//     next();
// }
//app.use(redirectToHttps);

app.use(express.static(publicDirectory));
app.use(express.json());
// app.use(sslRedirect());
//console.log(process.env.NODE_ENV);

//If above redirecToHttps doesn't work!!!
//For redirecting other than heroku. 
// const redirectToHttps = (req, res, next) => {
//     console.log("on app.use");
//     if (req.header('x-forwarded-proto') !== 'https') {
//         console.log(`https://${req.header('host')}${req.url}`);
//         // return res.redirect(`https://google.com`);
//         return res.redirect(`https://${req.header('host')}${req.url}`);
//     }
//     else {
//         next();
//     }
// }

// if(process.env.NODE_ENV === 'production') {
//     app.use(redirectToHttps);
// }

const users = [];

io.on("connection", (socket) => {
    socket.on("join", ({ username, _id }, callback) => {
        const exits = users.findIndex((user) => user.userId === _id);
        if (exits >= 0) {//-1 if not present. So, by that 
            users.splice(exits, 1);
        }
        users.push({ socketId: socket.id, username, userId: _id });
        socket.join(_id);
        // console.log("After splice:", users);
        // console.log("Before splice", users);
        // console.log("Final array:", users);
        // console.log(_id, username);
    });

    socket.on("sendMessage", (message, callback) => {
        io.to(...message.receivers).emit("message", message);
        const { username } = users.find((user) => user.userId === message.sender);
        io.to(...message.receivers).emit("messageAlert", { senderId: message.sender });
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