import React, { Component } from 'react'

export default class ProtectedRoute extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        return (
            <div>
                <p>Message: {true}</p>
            </div>
        )
    }
}
