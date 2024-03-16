const mysql = require('mysql2/promise');

const validateLogin = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Sonu@2001',
        database: 'chat'
    });

    try {
        // check if the user exists in the database
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const [result] = await connection.query(query, [username, password]);

        if (result.length === 0) {
            res.send('Invalid username or password');
        } else {
            console.log('User logged in');
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
    
    await connection.end();
    next();
};

module.exports = validateLogin;
