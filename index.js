const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// تقديم ملفات HTML من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// إنشاء أو فتح قاعدة بيانات SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) return console.error('❌ DB error:', err);
  console.log('✅ Connected to SQLite');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  age INTEGER
)`);

// Route لإضافة مستخدم جديد
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  db.run('INSERT INTO users (name, age) VALUES (?, ?)', [name, age], function(err) {
    if (err) return res.status(500).send(err.message);
    res.send({ id: this.lastID, name, age });
  });
});

// Route لجلب كل المستخدمين
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.send(rows);
  });
});

// تشغيل السيرفر على البورت 4000
app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
