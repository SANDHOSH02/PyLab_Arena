const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const db = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Get all levels
app.get('/api/levels', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, level_number, title FROM levels ORDER BY level_number');
    return res.json(rows);
  } catch (err) {
    console.error('Get levels error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get lessons (optional query param: ?level=1)
app.get('/api/lessons', async (req, res) => {
  try {
    const level = req.query.level;
    if (level) {
      const [rows] = await db.execute('SELECT id, level_id, lesson_number, title, content FROM lessons WHERE level_id = ? ORDER BY lesson_number', [level]);
      return res.json(rows);
    }
    const [rows] = await db.execute('SELECT id, level_id, lesson_number, title, content FROM lessons ORDER BY level_id, lesson_number');
    return res.json(rows);
  } catch (err) {
    console.error('Get lessons error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name || null, email, hash]);
    return res.status(201).json({ id: result.insertId, message: 'Account created successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const [rows] = await db.execute('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // For now return basic user info (no JWT). Frontend can store session as needed.
    return res.json({ id: user.id, name: user.name, email: user.email, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`PyLab backend listening on port ${PORT}`);
});
