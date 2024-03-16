const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db_connection.js');
const validateLogin = require('./controller/validateLogin.js');
const signupHandler = require('./controller/signupHandler.js');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// home page route
app.get('/', (req, res) => {
    res.sendFile('./resources/index.html', { root: __dirname });
});

// route to serve login page
app.get('/loginPage', (req, res) => {
    res.sendFile('./resources/login.html', { root: __dirname });
});

// route to serve signup page
app.get('/signupPage', (req, res) => {
    res.sendFile('./resources/signup.html', { root: __dirname });
});

// route to validate login
app.post('/login', validateLogin, (req, res) => {
    // res.send('login successful');
    res.sendFile('./resources/chatPage.html', { root: __dirname });
    // res.json({status: 'success', message: 'login successful'});
});

// route to handle signup
app.post('/signupPage', signupHandler, (req, res) => {
    // res.send('signup successful');
    // res.sendFile('./resources/login.html', { root: __dirname });
    res.json({status: 'success', message: 'signup successful'});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});