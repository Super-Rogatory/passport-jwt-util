import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/components/App';
import axios from 'axios';


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = token;
      console.log(config.url);
    }
    return config;
  },
  (err) => {
      return Promise.reject(err);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

