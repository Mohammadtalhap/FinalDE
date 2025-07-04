const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.post('/api/signup', (req, res) => {
  console.log('✅ POST /api/signup hit'); // Debug: route was called
  console.log('📦 Received data:', req.body); // Debug: print the received data

  const { username, email, password, homeCountry, destinationCountry } = req.body;

  if (!username || !email || !password || !homeCountry || !destinationCountry) {
    console.log('⚠️ Missing required fields.');
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO users (username, email, password, home_country, destination_country)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [username, email, password, homeCountry, destinationCountry];

  db.run(sql, params, function (err) {
  if (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      console.error('❌ Email already exists:', err.message);
      return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
    } else {
      console.error('❌ Database insert failed:', err.message);
      return res.status(500).json({ message: 'Failed to register user.' });
    }
  }

  console.log(`✅ User '${username}' registered with ID ${this.lastID}`);
  res.status(200).json({ message: 'User registered successfully.' });
});
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const params = [username, password];

  db.get(sql, params, (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Login failed due to server error.' });
    }

    if (!row) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // ✅ Login successful, send back email
    res.status(200).json({ message: 'Login successful', email: row.email });
  });
});

app.get('/api/search', (req, res) => {
  const { destination, home } = req.query;

  let sql = `SELECT * FROM users`;
  const params = [];

  if (destination || home) {
    sql += ` WHERE 1=1`;

    if (destination) {
      sql += ` AND destination_country LIKE ?`;
      params.push(`%${destination}%`);
    }

    if (home) {
      sql += ` AND home_country LIKE ?`;
      params.push(`%${home}%`);
    }
  } else {
    // Default: limit to 10 latest users
    sql += ` ORDER BY id DESC LIMIT 10`;
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

// Temporary for quick view of database......

app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving users.' });
    }
    res.json(rows);
  });
});

app.post('/api/connect', (req, res) => {
  const { from, to } = req.body;

  if (!from || !to || from === to) {
    return res.status(400).json({ message: 'Invalid connection request.' });
  }

  const sql = `INSERT INTO connections (user_email, connected_email) VALUES (?, ?)`;

  db.run(sql, [from, to], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Connection failed or already exists.' });
    }
    res.status(200).json({ message: 'User connected successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
