const { Pool } = require('pg');

const pool = new Pool({
    user: 'todo_user',
    host: '10.3.15.52',
    database: 'todo_app_db',
    password: '123',
    port: 5432,
});