const WebSocket = require('ws');
const db = require('../db_connection.js');

// Create a WebSocket server using the existing HTTP server
function setupWebSocket(server, session) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        console.log('New client connected');
        
        // Extract session ID from cookies
        const sessionId = req.headers.cookie?.split('=')[1];
        const username = session[sessionId];

        if (!username) {
            ws.close();
            return;
        }

        ws.on('message', async (message) => {
            try {
                console.log('Received: %s', message);

                // Parse the incoming message
                const data = JSON.parse(message);

                // Create a connection to the database
                const connection = await db();

                // Save the message to the database
                const [user] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
                if (user.length > 0) {
                    await connection.query('INSERT INTO messages (user_id, text) VALUES (?, ?)', [user[0].id, data.text]);
                }

                // Broadcast the message to all connected clients
                const processedMessage = {
                    username,
                    text: data.text,
                    created_at: new Date().toISOString()
                };

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(processedMessage));
                    }
                });
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = setupWebSocket;