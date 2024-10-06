const mysql = require('mysql2/promise');

const db = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sonu@2001',
        });
        console.log("Connected to the MySQL server");

        // Check if the database exists
        const [rows] = await connection.query("SHOW DATABASES LIKE 'chat'");
        if (rows.length === 0) {
            console.log("Database does not exist, creating database...");
            await connection.query("CREATE DATABASE chat");
            console.log("Database 'chat' created");
        }

        // Connect to the 'chat' database
        await connection.changeUser({ database: 'chat' });
        console.log("Connected to the 'chat' database");

        // Check if the 'users' table exists, and create it if it doesn't
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

        // Check if the 'messages' table exists, and create it if it doesn't
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

        return connection;
    } catch (error) {
        console.error("Error handling the database connection:", error);
        throw error;
    }
}

module.exports = db;