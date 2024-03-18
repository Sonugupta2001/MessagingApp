const WebSocket = require('ws');
const db = require('../db_connection.js');


// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// start the websocket server
wss.on('connection', (ws) => {
    console.log('New client connected');
    // receive the message from the client and save it to the database
    ws.on('message', async (message) => {
        console.log('received: %s', message);

        // create a connection to the database
        const connection = await db();

        // select the database 'messages' to which the message will be saved
        await connection.query('USE messages');
        // save the message to the database, with table name 'message' to the column 'text'
        const query1 = 'INSERT INTO message (text) VALUES (?)'
        await connection.query(query1, [message]);
        // fetch all messages from the database with the table name 'message'
        const query2 = 'SELECT * FROM message';
        const [result] = await connection.query(query2);

        // close the connection to the database
        await connection.end();

        /*
        // send the messages to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(result));
            }
        });
        */
    });
});

/*
// broadcast the message to all connected clients
wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(data);
        }
    });
};
*/


// export this module
module.exports = wss;