const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const loginIsRequired = require('../middleware/loginIsRequired');



router.post('/lists', loginIsRequired, async (req, res) => {
    const { title, description } = req.body;

    if(!title) {
        return res.status(400).json({ error: 'Titel darf nicht leer sein.'});
    }


    try {
        const result = await pool.query('INSERT INTO lists (user_id, title, description) VALUES ($1, $2, $3)', 
            [req.session.user.id, title, description]
        );
    } catch(err) {
        console.error(err);
        res.status(500).json ({ error: 'Fehler beim Erstellen der Liste'});
    }
});


module.exports = router;