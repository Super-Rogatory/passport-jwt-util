import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedComponent';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home}></Route> 
                    <Route path='/register' component={Register}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/protected' component={ProtectedRoute}></Route>
                </Switch>
            </Router>
        )
    }
}
export default App;