import React from 'react'
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h1>JWT Auth</h1>
            <Link to='/login'><p>Login</p></Link>
            <Link to='/register'><p>Register</p></Link>
            <Link to='/protected'><p>Protected</p></Link>
        </div>
    )
}
