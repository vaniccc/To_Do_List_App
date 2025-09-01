const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const loginIsRequired = require('../middleware/loginIsRequired');


router.post('/', loginIsRequired, async (req, res) => {
  const { list_id, title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (list_id, title, description, is_done) VALUES ($1, $2, $3, false) RETURNING *',
      [list_id, title, description || '']
    );
    console.log('Todo gespeichert:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Anlegen des Todos' });
  }
});

router.get('/:listId', loginIsRequired, async (req, res) => {
  const { listId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE list_id = $1', [listId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden der Todos' });
  }
});

module.exports = router;
