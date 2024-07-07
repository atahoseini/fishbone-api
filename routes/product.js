const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

async function getProductById(req, res) {
  try {
    const row = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllProducts(req, res) {
  try {
    const rows = await all('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addProduct(req, res) {
  const { productName, productDescription, productPrice, productStock } = req.body;

  const sql = `INSERT INTO products (productName, productDescription, productPrice, productStock)
               VALUES (?, ?, ?, ?)`;
  const params = [productName, productDescription, productPrice, productStock];

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

async function editProduct(req, res) {
  const { id, productName, productDescription, productPrice, productStock } = req.body;
  try {
    const result = await run(`UPDATE products SET productName = ?, productDescription = ?, productPrice = ?, productStock = ? WHERE id = ?`,
      [productName, productDescription, productPrice, productStock, id]);
    res.json({ changes: result.changes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Routes
router.get('/:id', getProductById);
router.get('/', getAllProducts);
router.put('/edit', editProduct);
router.post('/', addProduct);

module.exports = router;
