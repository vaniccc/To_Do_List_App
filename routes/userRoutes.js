const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    
        const { username, password, confirmPassword } = req.body;

        if(username.length < 4) {
            return res.status(400).json({ error: "Der Benutername muss mindestens 4 Zeichen enthaltn."});
        }
        
        if(password.length < 1) {
            return res.status(400).json({ error: "Das Passwort muss mindestens 8 Zeichen enthalten"});
        }

        if(password.value != confirmPassword.value) {
            return res.status(400).json({ error: "Passwörter stimmen nicht überein."});
        }

    try {
        try{
            // const userCheck = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);        
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);       
        console.log("UserCheck 1: ");
        console.log(userCheck.rows);

        if(userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Benutzername ist bereits vergeben.'});
        }

        }catch (err) {
            console.error(err);
        }
        
        const hashedPassword = await bcrypt.hash(password, 10); 

        // await pool.query(
        //     `INSERT INTO users (username, password_hash) VALUES ('${username}', '${hashedPassword}');`);

        try {
      const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        console.log("result: ");
        console.log(result.rows); 
        } catch (erro) {
            console.error(erro);
        }

        res.status(201).json({ message: "Benutzer erfolgreich registiert"});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfehler"});
    }    
});

module.exports = router;