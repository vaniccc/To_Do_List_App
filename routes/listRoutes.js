const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const loginIsRequired = require('../middleware/loginIsRequired');


router.get('/', loginIsRequired, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lists WHERE user_id = $1 ORDER BY list_id DESC', [req.session.user.id]);

        res.json(result.rows);

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Laden der Listen'});
    }
});

router.post('/', loginIsRequired, async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query('INSERT INTO lists (user_id, title, description) VALUES ($1, $2, $3) RETURNING *', 
            [req.session.user.id, title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Anlegen der Liste'});
    }
});

router.patch('/:listId', loginIsRequired, async (req, res) => {
  const { listId } = req.params;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE lists SET title = $1, description = $2 WHERE list_id = $3 RETURNING *',
      [title, description, listId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Liste nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Liste' });
  }
});

module.exports = router;