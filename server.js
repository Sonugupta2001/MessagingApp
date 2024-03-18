const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db_connection.js');
const uuid = require('uuid').v4;
const validateLogin = require('./controller/validateLogin.js');
const signupHandler = require('./controller/signupHandler.js');
const wss = require('./controller/webSocket.js');

const app = express();
const port = 3000;
const session = {};

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

// route to handle signup
app.post('/signupPage', signupHandler, (req, res) => {
    // res.send('signup successful');
    // res.sendFile('./resources/login.html', { root: __dirname });
    res.json({status: 'success', message: 'signup successful'});
});

// route to validate login
app.post('/login', validateLogin, (req, res) => {
    const sessionId = uuid();
    session[sessionId] = req.body.username;
    res.set('Set-Cookie', `session=${sessionId}`);

    // res.send('login successful');
    // res.sendFile('./resources/chatPage.html', { root: __dirname });
    res.json({status: 'success', message: 'login successful'});
});

// route to serve chat page
app.get('/chatPage', (req, res) => {
    const sessionId = req.headers.cookie.split('=')[1];
    
    if (session[sessionId]) {
        res.sendFile('./resources/chatPage.html', { root: __dirname });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// route to serve initial messages
app.get('/chats', async (req, res) => {
    const connection = await db();
    await connection.query('USE messages');
    const query = 'SELECT text FROM message';
    const [result] = await connection.query(query);
    res.json(result);
});

// route to handle logout
app.get('/logout', (req, res) => {
    const sessionId = req.headers.cookie.split('=')[1];
    delete session[sessionId];
    res.clearCookie('session');

    res.sendFile('./resources/index.html', { root: __dirname });
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});