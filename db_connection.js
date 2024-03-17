const mysql = require('mysql2/promise');

const db = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Sonu@2001',
        database: 'chat'
    });
    return connection;
}

module.exports = db;