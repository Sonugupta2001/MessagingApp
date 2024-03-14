const signupHandler = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;

    try{
        // save the user data to the database
        db.query(`INSERT INTO users (username, password, email, phone) VALUES ('${username}', '${password}', '${email}', '${phone}')`, (err, result) => {
            if (err) throw err;
            res.send('Signup Successful');
        });
    }
    
    catch(error){
        console.log(error);
    }
}

module.exports = signupHandler;