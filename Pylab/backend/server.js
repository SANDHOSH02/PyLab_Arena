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
      const [rows] = await db.execute('SELECT id, level_id, lesson_number, title, content, youtube_link, document_link FROM lessons WHERE level_id = ? ORDER BY lesson_number', [level]);
      return res.json(rows);
    }
    const [rows] = await db.execute('SELECT id, level_id, lesson_number, title, content, youtube_link, document_link FROM lessons ORDER BY level_id, lesson_number');
    return res.json(rows);
  } catch (err) {
    console.error('Get lessons error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single lesson by id
app.get('/api/lessons/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.execute('SELECT id, level_id, lesson_number, title, content, key_notes, syntax, important_questions, youtube_link, document_link FROM lessons WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Lesson not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Get lesson error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get MCQ questions for a lesson
app.get('/api/lessons/:id/mcq', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.execute('SELECT id, lesson_id, question, option_a, option_b, option_c, option_d, correct_option FROM lesson_mcq WHERE lesson_id = ?', [id]);
    return res.json(rows);
  } catch (err) {
    console.error('Get lesson mcq error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Save MCQ result for a lesson
app.post('/api/lessons/:id/mcq/result', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { user_id, score } = req.body;
    if (typeof score !== 'number') return res.status(400).json({ message: 'Score (number) is required' });

    const [result] = await db.execute('INSERT INTO mcq_results (user_id, lesson_id, score) VALUES (?, ?, ?)', [user_id || null, lessonId, score]);
    return res.status(201).json({ id: result.insertId, message: 'Result saved' });
  } catch (err) {
    console.error('Save mcq result error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get aggregated user stats (lessons completed, problems solved, XP, recent activity)
app.get('/api/users/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;
    // basic counts
    const [lessonsRows] = await db.execute('SELECT COUNT(DISTINCT lesson_id) AS lessonsCompleted FROM mcq_results WHERE user_id = ?', [userId]);
    const lessonsCompleted = lessonsRows && lessonsRows[0] ? lessonsRows[0].lessonsCompleted || 0 : 0;

    const [problemsRows] = await db.execute('SELECT COUNT(*) AS problemsSolved FROM problem_results WHERE user_id = ?', [userId]);
    const problemsSolved = problemsRows && problemsRows[0] ? problemsRows[0].problemsSolved || 0 : 0;

    const [mcqScoreRows] = await db.execute('SELECT COALESCE(SUM(score),0) AS mcqScore FROM mcq_results WHERE user_id = ?', [userId]);
    const mcqScore = mcqScoreRows && mcqScoreRows[0] ? mcqScoreRows[0].mcqScore || 0 : 0;

    const [probScoreRows] = await db.execute('SELECT COALESCE(SUM(score),0) AS problemScore FROM problem_results WHERE user_id = ?', [userId]);
    const problemScore = probScoreRows && probScoreRows[0] ? probScoreRows[0].problemScore || 0 : 0;

    const totalXP = Number(mcqScore) + Number(problemScore);

    const [levelsRows] = await db.execute('SELECT COUNT(DISTINCT l.level_id) AS levelsCompleted FROM mcq_results m JOIN lessons l ON m.lesson_id = l.id WHERE m.user_id = ?', [userId]);
    const levelsCompleted = levelsRows && levelsRows[0] ? levelsRows[0].levelsCompleted || 0 : 0;

    // currentStreak: distinct days with activity in last 7 days
    const [streakRows] = await db.execute(
      `SELECT COUNT(DISTINCT dt) AS streak FROM (
         SELECT DATE(attempted_at) AS dt FROM mcq_results WHERE user_id = ? AND attempted_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         UNION ALL
         SELECT DATE(submitted_at) AS dt FROM problem_results WHERE user_id = ? AND submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       ) t`,
      [userId, userId]
    );
    const currentStreak = streakRows && streakRows[0] ? streakRows[0].streak || 0 : 0;

    // recent activity: latest 8 items from mcq_results and problem_results with titles
    const [recentRows] = await db.execute(
      `SELECT type, id, title, score, time FROM (
         SELECT 'mcq' AS type, m.id AS id, l.title AS title, m.score AS score, m.attempted_at AS time
         FROM mcq_results m
         JOIN lessons l ON m.lesson_id = l.id
         WHERE m.user_id = ?
         UNION ALL
         SELECT 'problem' AS type, pr.id AS id, p.title AS title, pr.score AS score, pr.submitted_at AS time
         FROM problem_results pr
         JOIN problems p ON pr.problem_id = p.id
         WHERE pr.user_id = ?
       ) sq
       ORDER BY time DESC
       LIMIT 8`,
      [userId, userId]
    );

    // approximate hours learned: 30 minutes per lesson completed
    const hoursLearned = Number(lessonsCompleted) * 0.5;

    // derive level from XP (simple mapping: 0-499 -> 1, 500-999 ->2, etc.)
    const level = Math.max(1, Math.floor(totalXP / 500) + 1);
    const nextLevelXP = (level * 500);

    return res.json({
      lessonsCompleted,
      problemsSolved,
      totalXP,
      levelsCompleted,
      currentStreak,
      hoursLearned,
      level,
      nextLevelXP,
      recentActivity: recentRows || []
    });
  } catch (err) {
    console.error('Get user stats error:', err);
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
