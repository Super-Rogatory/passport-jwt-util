import React, { Component } from 'react'

export default class Login extends Component {
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
        const { handleChange } = this;
        return (
            <div>
                <h1>Login</h1>
                <form>
                    <input type='text' name='username' placeholder='username' value={this.state.username} onChange={handleChange} />
                    <input type='text' name='password' placeholder='password' value={this.state.password} onChange={handleChange} />
                </form>
            </div>
        )
    }
}
