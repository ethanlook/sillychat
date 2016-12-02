/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';


import React from 'react';

/*************************************************************************/

class Message extends React.Component {
    render() {
        return <div>
            <span className="user">{this.props.msg.username}: </span>
            <span className="msg">{this.props.msg.text}</span>
        </div>;
    }
}

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.onSend = this.onSend.bind(this);
        this.onMsgReceive = this.onMsgReceive.bind(this);
    }

    onMsgReceive(msg) {
        console.log('ChatView: ' + JSON.stringify(msg));
        this.setState({ messages: this.state.messages.concat([msg])});
    }

    componentWillMount() {
        this.props.dispatcher.on('receive', this.onMsgReceive);
        this.props.dispatcher.on('room', () => {
            this.setState({ messages: [] });
        });
    }

    componentWillUnmount() {
        this.props.dispatcher.off('receive', this.onMsgReceive);
    }

    onSend(ev) {
        ev.preventDefault();
        let target = $('#m');
        this.props.dispatcher.trigger('send', { text: target.val() });
        target.val('');
    }

    render() {
        let i = 0;
        let messages = this.state.messages.map((msg) => <Message key={i++} msg={msg} />);
        return <div>
            <ul id="messages">{messages}</ul>
            <form className="chatform">
                <input id="m" autoComplete="off" />
                <button onClick={this.onSend}>Send</button>
            </form>
        </div>
    }
}