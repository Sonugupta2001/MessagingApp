const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db_connection.js');
const uuid = require('uuid').v4;
const validateLogin = require('./controller/validateLogin.js');
const signupHandler = require('./controller/signupHandler.js');
const WebSocket = require('ws');
const setupWebSocket = require('./controller/webSocket.js');
const checkSession = require('./controller/checkSession.js');
const session = require('./controller/session.js');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Home page route
app.get('/', (req, res) => {
    res.sendFile('./resources/index.html', { root: __dirname });
});

// Route to serve login page
app.get('/loginPage', (req, res) => {
    res.sendFile('./resources/login.html', { root: __dirname });
});

// Route to serve signup page
app.get('/signupPage', (req, res) => {
    res.sendFile('./resources/signup.html', { root: __dirname });
});

// Route to handle signup
app.post('/signupPage', signupHandler, (req, res) => {
    res.send({ status: 'success', message: 'signup successful' });
});

// Route to validate login
app.post('/login', validateLogin, (req, res) => {
    const sessionId = uuid();
    session[sessionId] = req.body.username;
    res.set('Set-Cookie', `session=${sessionId}; HttpOnly`);
    res.json({ status: 'success', message: 'login successful' });
});

// Route to serve chat page
app.get('/chatPage', (req, res) => {
    const sessionId = req.headers.cookie?.split('=')[1];
    if (session[sessionId]) {
        res.sendFile('./resources/chatPage.html', { root: __dirname });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Initialize database connection and ensure schema is set up
(async () => {
    try {
        const connection = await db();

        // Ensure the 'users' table exists
        const [userTables] = await connection.query("SHOW TABLES LIKE 'users'");
        if (userTables.length === 0) {
            console.log("Table 'users' does not exist, creating table...");
            const createUsersTableQuery = `
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    phone VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            await connection.query(createUsersTableQuery);
            console.log("Table 'users' created");
        }

        // Ensure the 'messages' table exists
        const [messageTables] = await connection.query("SHOW TABLES LIKE 'messages'");
        if (messageTables.length === 0) {
            console.log("Table 'messages' does not exist, creating table...");
            const createMessagesTableQuery = `
                CREATE TABLE messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    text VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `;
            await connection.query(createMessagesTableQuery);
            console.log("Table 'messages' created");
        }
    }
    catch (error) {
        console.error("Error during database initialization:", error);
    }
})();


// Route to serve initial messages with session check
app.get('/chats', checkSession, async (req, res) => {
    try {
        const connection = await db();
        const query = `
            SELECT messages.text, users.username, messages.created_at 
            FROM messages 
            JOIN users ON messages.user_id = users.id
        `;
        const [result] = await connection.query(query);
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle logout
app.get('/logout', (req, res) => {
    const sessionId = req.headers.cookie?.split('=')[1];
    if (sessionId) {
        delete session[sessionId];
        res.clearCookie('session');
    }
    res.sendFile('./resources/index.html', { root: __dirname });
});

// Start the server and WebSocket server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
setupWebSocket(server, session); // Use the same server for WebSocket