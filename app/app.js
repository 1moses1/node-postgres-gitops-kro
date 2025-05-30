require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 8086;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'formdb',
  port: process.env.PGPORT || 5432
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC');
  res.render(path.join(__dirname, 'views/index'), { submissions: result.rows });
});

app.post('/submit', async (req, res) => {
  const { name, email } = req.body;
  await pool.query('INSERT INTO submissions (name, email) VALUES ($1, $2)', [name, email]);
  res.redirect('/');
});

app.listen(port, '0.0.0.0', () => console.log(`App running on port ${port}`));
