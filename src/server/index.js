'use strict';

let path            = require('path'),
    express         = require('express'),
    http            = require('http'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    io              = require('socket.io'),
    _               = require('lodash');


let app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use(logger('combined'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

let rooms = [
    { id: 'room1', name: 'Room 1', count: 0, messages: [] },
    { id: 'room2', name: 'Room 2', count: 0, messages: [] },
    { id: 'room3', name: 'Room 3', count: 0, messages: [] },
    { id: 'room4', name: 'Room 4', count: 0, messages: [] },
    { id: 'room5', name: 'Room 5', count: 0, messages: [] }
];

app.get('/v1/rooms', (req, res) => {
    res.status(200).send(rooms);
});

// Render the base HTML document
app.get('*', (req, res) => {
    res.render('base', { title: 'My little chat app' });
});


let server = http.Server(app);
server.listen(8080, () => {
    console.log('Example app listening on ' + server.address().port);
});

let ioServer = io(server);
ioServer.on('connection', function(socket){
    // Reconnection triggers rejoin room
    if (socket.room) socket.join(socket.room);

    socket.on('user', function(msg) {
        socket.user = msg.username;
        console.log('User connected: ' + socket.user);
    });

    socket.on('room', function(msg) {
        console.log(socket.user + ' wants to join: ' + msg.room);
        if (socket.room) socket.leave(socket.room);
        socket.room = msg.room;
        socket.join(msg.room);
    });

    socket.on('msg', function(msg){
        console.log(socket.user + '(' + msg.room + '): ' + msg.text);
        msg = _.extend(msg, { username: socket.user });
        ioServer.sockets.in(socket.room).emit('msg', msg);
        //ioServer.emit('msg', msg);
    });

    socket.on('disconnect', function(){
        console.log('User disconnected');
    });
});