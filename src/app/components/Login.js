import React, { Component } from 'react'
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
export default class Login extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            redirectToApp: false,
            logout: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e){
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state; // want to get username and password properties out of this.state
        const reqObject = { username, password }; // want to create an object literal with username and password properties using shorthand syntax
        axios.post('http://localhost:8080/api/users/login', reqObject, { headers: {'Content-type': 'application/json' }} )
        .then((res) => {
            this.setLocalStorage(res.data);
            this.setState({redirectToApp: true});
        })
        .catch((err) => console.log(err));
    }
    setLocalStorage(responseObject){
        const expires = moment().add(responseObject.expiresIn);
        localStorage.setItem('token', responseObject.token);
        localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
    }
    render() {
        const { handleChange, handleSubmit } = this;
        const { redirectToApp } = this.state;
        if(redirectToApp) return <Redirect to='/protected' />
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input type='text' name='username' placeholder='username' value={this.state.username} onChange={handleChange} />
                    <input type='password' name='password' placeholder='password' value={this.state.password} onChange={handleChange} />
                    <button type='submit'>Enter</button>
                    <Link to='/register'><button>Register</button></Link>
                </form>
            </div>
        )
    }
}
