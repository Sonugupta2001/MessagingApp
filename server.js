const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db_connection.js');
const loginHandler = require('./controller/loginHandler.js');
const signupHandler = require('./controller/signupHandler.js');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log(req);
    res.sendFile('./resources/index.html', { root: __dirname });
});

app.post('/login', loginHandler, (req, res) => {
    res.sendFile('./resources/chatPage.html', { root: __dirname });
});

app.post('/signup', signupHandler, (req, res) => {
    res.sendFile('./resources/login.html', { root: __dirname });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});