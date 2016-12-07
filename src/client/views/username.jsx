/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';


import React from 'react';

/*************************************************************************/

export class Username extends React.Component {
    constructor(props) {
        super(props);
        this.onUsername = this.onUsername.bind(this);
    }

    onUsername(e) {
        e.preventDefault();
        this.props.dispatcher.trigger('username', { username: $('#username').val() });
        this.props.router.navigate('room1', { trigger: true });
    }

    render() {
        return <form className="form-horizontal well">
            <div className="form-group">
                <label htmlFor="username" className="col-sm-3 control-label">You should definitely enter a username:</label>
                <div className="col-sm-9">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="form-control"
                    />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                    <button className="btn btn-primary" onClick={this.onUsername}>You should definitely register</button>
                </div>
            </div>
        </form>;
    }
}