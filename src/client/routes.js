/* Copyright G. Hemingway, 2015 - All rights reserved */
"use strict";


import React from           'react';
import ReactDOM from        'react-dom';
import { Username } from    './views/username.jsx';
import { Chat } from        './views/chat.jsx';
import { Rooms } from       './views/rooms.jsx';

/*************************************************************************/

module.exports = Backbone.Router.extend({
    routes: {
        '':                             '_landing',
        'username':                     '_username',
        ':room':                        '_room',
        '*path':                        '_default'
    },
    initialize: function(options) {
        this.app = options.app;
        ReactDOM.render(<Rooms dispatcher={this.app} router={this} />, document.getElementById('rooms'));
    },

    _username: function() {
        ReactDOM.render(<Username router={this} dispatcher={this.app} />, document.getElementById('mainDiv'));
    },

    _room: function(room) {
        if (!this.app.state.username) {
            this.navigate('username', { trigger: true });
        } else {
            this.app.room = room;
            this.app.trigger('room', {room: room});
            ReactDOM.render(<Chat dispatcher={this.app} room={room}/>, document.getElementById('mainDiv'));
        }
    },

    _landing: function() {
        this.navigate('username', { trigger: true });
    },

    /************** Default Route ************************/

    _default: function(path) {
        console.log('Default path taken:' + path);
    }
});