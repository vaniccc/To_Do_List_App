const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    
        const { username, password, confirmPassword } = req.body;

        if(username.length < 4) {
            return res.status(400).json({ error: "Der Benutername muss mindestens 4 Zeichen enthaltn."});
            // alert('Der Benutername muss mindestens 4 Zeichen enthaltn.');
            // return;
        }
        
        if(password.length < 1) {
            return res.status(400).json({ error: "Das Passwort muss mindestens 8 Zeichen enthalten"});
            // alert('Das Passwort muss mindestens 8 Zeichen enthalten.');
            // return;
        }

        if(password.value != confirmPassword.value) {
            return res.status(400).json({ error: "Passwörter stimmen nicht überein."});
            //alert('Passwörter stimmen nicht überein.');
            //return;
        }

    try {

        try{
        // const userCheck = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);        
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);       
        
        console.log("UserCheck 1: ");
        console.log(userCheck.rows);

        if(userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Benutzername ist bereichts vergeben."})
        }

        } catch (err2) {
            console.error(err2);
        }
        
        const hashedPassword = await bcrypt.hash(password, 10); 

        // console.log(username);
        // console.log(hashedPassword);

        // await pool.query(
        //     `INSERT INTO users (username, password_hash) VALUES ('${username}', '${hashedPassword}');`);

        try {
      const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        } catch (erro) {
            console.error(erro);
        }

        res.status(201).json({ message: "Benutzer erfolgreich registiert"});


        const allUserCheck = await pool.query('SELECT * FROM users');

        // console.log("allUserCheck 1: ");
        // console.log(allUserCheck.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfehler: " + err.message});
    }    
});


router.post('/login', async (req, res) => {

    const {username, password} = req.body;

    try{

        const loginUserCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        const user = loginUserCheck.rows[0];

        const checkPassword = await bcrypt.compare(password, user.password_hash);

        if(loginUserCheck.rows.length === 0 || !checkPassword) {
            return res.status(400).json({ error: "Anmeldedaten falsch."});
        }

        req.session.user = {
            id: user.user_id,
            username: user.username
        };

        res.status(200).json({ message: "Login erfolgreich"});
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Serverfehler beim Login."});
    }
    
});

router.get('/user', (req, res) => {
    if(!req.session.user) {
        return res.status(401).json({ error: 'Nicht eingeloggt'});
    }
    res.json({ user: req.session.user });
});

router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Logout fehlgeschlagen'});
        } else {
            res.clearCookie('connect.sid');
            res.json({ message: 'Logout erfolgreich.'});
        }
    });
});

module.exports = router;