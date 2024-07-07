const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// Define async functions
async function getOrderById(req, res) {
  try {
    const row = await get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function getAllOrders(req, res) {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 5;
  const offset = (page - 1) * size;
  try {
    const rows = await all(`
      SELECT orders.*, users.userName, users.firstName, users.lastName, products.productName, products.productDescription, products.productPrice
      FROM orders
      JOIN users ON orders.userId = users.id
      JOIN products ON orders.productId = products.id
      LIMIT ? OFFSET ?
    `, [size, offset]);
    const totalOrders = await get('SELECT COUNT(*) as count FROM orders');
    res.json({
      data: rows,
      pageCount: Math.ceil(totalOrders.count / size)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function addOrder(req, res) {
  const { userId, productId, orderQuantity, orderTotal, orderDate, orderDescription } = req.body;

  const sql = `INSERT INTO orders (userId, productId, orderQuantity, orderTotal, orderDate, orderDescription)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [userId, productId, orderQuantity, orderTotal, orderDate, orderDescription];

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

async function editOrder(req, res) {
  const { id, userId, productId, orderQuantity, orderTotal, orderDate, orderDescription } = req.body;
  try {
    const result = await run(`UPDATE orders SET userId = ?, productId = ?, orderQuantity = ?, orderTotal = ?, orderDate = ?, orderDescription = ? WHERE id = ?`,
      [userId, productId, orderQuantity, orderTotal, orderDate, orderDescription, id]);
    res.json({ changes: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const result = await run('DELETE FROM orders WHERE id = ?', [req.query.id]);
    res.json({ changes: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.get('/:id', getOrderById);
router.get('/', getAllOrders);
router.post('/', addOrder);
router.post('/edit', editOrder);
router.delete('/delete', deleteOrder);

module.exports = router;
