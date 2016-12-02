/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';

import React from 'react';


/*************************************************************************/

class Room extends React.Component {
    onClick = (e) => {
        this.props.router.navigate(e.target.id, { trigger: true });
    };

    render() {
        let active = this.props.active ? 'room room-active' : 'room room-inactive';
        return <li id={this.props.id} className={active} onClick={this.onClick}>{this.props.name}</li>;
    }

    static propTypes = {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        router: React.PropTypes.object.isRequired,
        active: React.PropTypes.bool.isRequired,
    }
}


export class Rooms extends React.Component {
    state = {
        room: '',
        rooms: []
    };

    handleRoomSet = (msg) => {
        console.log('Room: ' + msg.room);
        this.setState({ room: msg.room });
    };

    componentWillMount() {
        this.props.dispatcher.on('room', this.handleRoomSet);
        $.ajax({
            url: '/v1/rooms',
            method: 'GET',
            success: (data) => {
                this.setState({rooms: data});
            },
            error: (err) => {
                console.log('Error:' + JSON.stringify(err));
            }
        });
    }

    componentWillUnmount() {
        this.props.dispatcher.off('room', this.handleRoomSet);
    }

    render() {
        let rooms = this.state.rooms.map((room) => (<Room
            id={room.id}
            key={room.id}
            name={room.name}
            router={this.props.router}
            active={room.id === this.state.room}
        />));
        return <ul className="rooms-list">{rooms}</ul>;
    }

    static propTypes = {
        dispatcher: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    }
}