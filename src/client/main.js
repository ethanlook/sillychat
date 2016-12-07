/* Copyright G. Hemingway, 2015 - All rights reserved */
"use strict";


// Necessary modules
require('bootstrap-webpack');
require('./stylesheets/base.css');
let Router          = require('./routes');
let io = require("socket.io-client");

/*************************************************************************/

// Primary App class
let App  = function() {
    this.state = {
        username: '',
        room: ''
    };
    // Establish the global URL router
    this.router = new Router({ app: this });
    Backbone.history.start({ pushState: true });

    let socket = io();
    socket.on('connect', () => {
        console.log('Socket client connected');
        // Register who the user is
        this.on('username', (msg) => {
            this.state.username = msg.username;
            socket.emit('user', msg);
        });

        this.on('room', () => {
            socket.emit('room', { room: this.state.room });
        });

        this.on('send', (msg) => {
            msg = _.extend(msg, { room: this.state.room });
            socket.emit('msg', msg);
        });

        socket.on('msg', (data) => {
            console.log(data);
            if (data.room === this.state.room)
                this.trigger('receive', data);
        });

    });
};

_.extend(App.prototype, Backbone.Events);

/*************************************************************************/

// Invoke the new app
module.exports = new App();