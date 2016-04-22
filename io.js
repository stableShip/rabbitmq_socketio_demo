"use strict"

var socketioJwt = require("socketio-jwt");
var socket_io = require("socket.io");
var io = socket_io();


io.use(socketioJwt.authorize({
    secret: 'socketIoSecret',
    handshake: true
}));

var users = {};
var numUsers = 0;
io.on("connection", function (socket) {
    var addedUser = false;
    console.log('hello! ', socket.decoded_token.name);

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser) return;
        if (users[username]) {
            console.log("断开", username, socket.id, "连接");
            users[username].disconnect();
        }
        users[username] = socket;
        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    socket.on('private_chat', function (data) {
        console.log("私聊:", data)
        // echo globally that this client has left

    });
})


io.privateChat = function (data) {
    console.log(data);
    var client = users[data.to];
    if(client) {
        var sentMessage = {
            username: data.from,
            message: data.message,
            talkTo: data.talkTo
        }
        client.emit("private_chat", sentMessage);
    }else{
        return false;
    }
}


io.broadcast = function (data) {
    var client = users[data.from];
    if(client) {
        client.broadcast.emit('new message', {
            username: client.username,
            message: data.message
        });
        return true;
    }else{
        return false;
    }
}

module.exports = io;