import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
export default class Login extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: ''
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
        const reqObject = {...this.state};
        axios.post('http://localhost:8080/api/users/login', reqObject, { headers: {'Content-type': 'application/json' }} )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
    render() {
        const { handleChange, handleSubmit } = this;
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
