import React, { Component } from 'react'
import axios from 'axios';

export default class ProtectedRoute extends Component {
    constructor(){
        super();
        this.state = {
            userInformation: '',
            loggedIn: false
        }
        this.handleLogout = this.handleLogout.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:8080/api/users/protected')
        .then((res) => {
            this.setState({ 
                userInformation: res.data.msg,
                loggedIn: true 
            })
            console.log(res);
        })
        .catch((err) => {
            this.setState({ userInformation: 'You are not authorized to visit this route' });
            console.log(err);
        });
    }
    handleLogout() {
        // if there is no token, the user will have to enter in username and password again
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
        this.setState({
            loggedIn: false
        });
        this.props.history.push('/login');
    }
    render() {
        const { userInformation, loggedIn } = this.state;
        const { handleLogout } = this;
        return (
            <div>
                { userInformation && <p>Message: {userInformation}</p> }
                { loggedIn && <button onClick={handleLogout}>Log Out</button> }
            </div>
        )
    }
}
