const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

router.get('/all', getAllUsersWithoutPagination);
router.get('/username/:username', getUserByUsername);   
router.get('/id/:id', getUserById);   
router.get('/', getAllUsers);
router.post('/', addUser);
router.post('/edit', editUser);


async function getUserById(req, res) {
  try {
    const row = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserByUsername(req, res) {
  try {
    const row = await get('SELECT * FROM users WHERE userName = ?', [req.params.username]);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 5;
  const offset = (page - 1) * size;
  try {
    const rows = await all('SELECT * FROM users LIMIT ? OFFSET ?', [size, offset]);
    const totalUsers = await get('SELECT COUNT(*) as count FROM users');
    res.json({
      data: rows,
      pageCount: Math.ceil(totalUsers.count / size)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsersWithoutPagination(req, res) {
  try {
    console.log("getAllUsersWithoutPagination called..."); 
    const rows = await all('SELECT * FROM users');
    console.log("Rows fetched:", rows); 
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err); 
    res.status(500).json({ error: err.message });
  }
}

async function addUser(req, res) {
  let { userName, firstName, lastName, password, passwordSalt, registerDate, lastLoginDate } = req.body;

  if (!passwordSalt) {
    passwordSalt = password;
  }

  const currentDate = new Date().toISOString().split('T')[0];
  registerDate = registerDate || currentDate;
  lastLoginDate = lastLoginDate || currentDate;

  const sql = `INSERT INTO users (userName, firstName, lastName, password, passwordSalt, registerDate, lastLoginDate)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [userName, firstName, lastName, password, passwordSalt, registerDate, lastLoginDate];

  try {
    const result = await run(sql, params);
    if (result && result.lastID) {
      res.status(201).json({ id: result.lastID });
    } else {
      res.status(500).json({ error: 'Failed to retrieve the last inserted ID.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function editUser(req, res) {
  const { id, userName, firstName, lastName, password, passwordSalt, registerDate, lastLoginDate } = req.body;
  try {
    const result = await run(`UPDATE users SET userName = ?, firstName = ?, lastName = ?, password = ?, passwordSalt = ?, registerDate = ?, lastLoginDate = ? WHERE id = ?`,
      [userName, firstName, lastName, password, passwordSalt, registerDate, lastLoginDate, id]);
    res.json({ changes: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = router;
