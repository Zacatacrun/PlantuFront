const express = require('express');
const router = express.Router();
const pool = require('../../../database');


// Endpoint para obtener una lista de productos que cumplen con las condiciones especificadas
router.get('/getProduct', async (req, res) => {
const { id } = req.body;
if(!(!id)){
  const productId = id;

  try {
    const [rows] = await pool.query('SELECT * FROM plantas WHERE id = ?', [productId]);

    if (!rows || !Object.keys(rows).length) {
      return res.status(404).json({
          status: 0,
          data: [],
          warnings: [],
          info: 'El producto no existe',
      });
    }
    const product = rows;

    return res.status(200).json({
    status: 1,
    data: product,
    warnings: [],
    info: 'Producto encontrado',
    });
  } 
    catch (err) {
      console.error(err);
      return res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error al obtener el producto',
      });
  }
}
  else{
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error al obtener el producto',
      });
  }
});


module.exports = router;
