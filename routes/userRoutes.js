const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'todo_user',
    host: '10.3.15.52',
    database: 'todo_app_db',
    password: '123',
    port: 5432
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        if(username.value.length < 4) {
            return res.status(400).json({ error: "Der Benutername muss mindestens 4 Zeichen enthaltn."});
        }
        
        if(password.value.length < 1) {
            return res.status(400).json({ error: "Das Passwort muss mindestens 8 Zeichen enthalten"});
        }

        if(password.value != confirmPassword.value) {
            return res.status(400).json({ error: "Passwörter stimmen nicht überein."});
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const result = await pool.query(`INSERT INTO users (username, password_hash) VALUES ('${username}', '${hashedPassword}');`);

        res.status(201).json({ message: "Benutzer erstellt"});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Serverfehler"});
    }
    
});

module.exports = router;