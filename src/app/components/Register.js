import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

export default class Register extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            redirectToLogin: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setLocalStorage = this.setLocalStorage.bind(this);
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
        axios.post('http://localhost:8080/api/users/register', reqObject, { headers: {'Content-type': 'application/json'}} )
        .then((res) => {
            this.setLocalStorage(res.data);
            this.setState({redirectToLogin: true});
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
        const { redirectToLogin } = this.state;
        if(redirectToLogin) return <Redirect to='/login' />;
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input type='text' name='username' placeholder='username' value={this.state.username} onChange={handleChange} />
                    <input type='password' name='password' placeholder='password' value={this.state.password} onChange={handleChange} />
                    <button type='submit'>Enter</button>
                </form>
            </div>
        )
    }
}
