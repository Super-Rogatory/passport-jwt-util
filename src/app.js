const express = require('express');
// const cors = require('cors');
const path = require('path');
// const passport = require('passport');

require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const app = express();

// Connect database, ensure table is created and connection is secured.
require('./server/db/User');

// Pass the global passport object into the config function
// require('./config/passport')(passport);

// Initialize the passport object on every request
// app.use(passport.initialize());

// Parse req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Statically Serve Public files in src directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./server/api/index'));

app.listen(8080, () => console.log('server: listening on port 8080'));

