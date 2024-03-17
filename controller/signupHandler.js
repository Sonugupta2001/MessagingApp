const db = require('../db_connection.js');

const signupHandler = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
    
    const connection = await db();

    try{
        // save the user data to the database
        const query = `INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)`;
        await connection.query(query, [username, password, email, phone]);
        console.log('User data saved to the database');
    }
    
    catch(error){
        console.log(error);
    }

    await connection.end();
    next();
}

module.exports = signupHandler;