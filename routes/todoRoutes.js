const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const loginIsRequired = require('../middleware/loginIsRequired');


router.post('/', loginIsRequired, async (req, res) => {
  const { list_id, title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (list_id, title, is_done) VALUES ($1, $2, false) RETURNING *',
      [list_id, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Anlegen des Todos' });
  }
});

module.exports = router;
