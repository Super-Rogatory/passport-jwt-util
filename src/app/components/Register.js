import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
const apiUrl = "http://localhost:8080";

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [apiUrl];
    const token = localStorage.getItem("token");

    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
      return Promise.reject(err);
  }
);
export default class Register extends Component {
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
        // const headers = new HttpHeaders({'Content-type': 'application/json'});
        const reqObject = {...this.state};
        axios.post('http://localhost:8080/api/users/register', reqObject, {headers: {'Content-type': 'application/json'}} )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
    render() {
        const { handleChange, handleSubmit } = this;
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input type='text' name='username' placeholder='username' value={this.state.username} onChange={handleChange} />
                    <input type='text' name='password' placeholder='password' value={this.state.password} onChange={handleChange} />
                    <button type='submit'>Enter</button>
                    <Link to='/login'><button>Login</button></Link>
                </form>
            </div>
        )
    }
}
