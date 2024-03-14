const db = require('../database/db');

const loginHandler = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try{
        // Query the database for the username and password
        db.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
            if (err) throw err;
            
            // If the query returns a result, then the login is successful
            if (result.length > 0) {
                console.log(result);
                res.send('Login Successful');
            } else {
                res.send('Login Failed');
            }
        });
    }

    catch(error){
        console.log(error);
    }

}

module.exports = loginHandler;

