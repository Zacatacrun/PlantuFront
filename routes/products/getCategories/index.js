const express = require('express');
const router = express.Router();
const pool = require('../../../database');

router.get('/getCategories', async (req, res) => {
  try {
    const categorias = await pool.query('SELECT * FROM categorias');
    return res.status(200).json({
      status: 1,
      data: categorias,
      warnings: [],
      info: 'Categorías encontradas',
      token: req.body.token
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error interno, intentalo de nuevo',
      token: req.body.token
    });
  }
});

module.exports = router;