const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { isEmail } = require('validator');

// Función para obtener la lista de productos que cumplen con las condiciones especificadas
async function getProductList(type, searchTerm, category) {
  let query = 'SELECT * FROM plantas WHERE 1=1';

  // Si se especificó un tipo de producto, se agrega la condición correspondiente a la consulta
  if (type && type !== 'All') {
    query += ` AND tipo = '${type}'`;
  }

  // Si se especificó un término de búsqueda, se agrega la condición correspondiente a la consulta
  if (searchTerm) {
    query += ` AND (nombre LIKE '%${searchTerm}%' OR descripcion LIKE '%${searchTerm}%')`;
  }

  // Si se especificó una categoría, se agrega la condición correspondiente a la consulta
  if (category) {
    query += ` AND categoria_id = ${category}`;
  }

  const [rows] = await pool.query(query);

  return rows;
}

// Endpoint para obtener una lista de productos que cumplen con las condiciones especificadas
router.get('/products', async (req, res) => {
const { type, searchTerm, category } = req.query;

try {
    const productList = await getProductList(type, searchTerm, category);

    return res.status(200).json({
    status: 1,
    data: productList,
    warnings: [],
    info: `Se encontraron ${productList.length} productos`,
    });
} catch (err) {
    console.error(err);
    return res.status(500).json({
    status: 0,
    data: [],
    warnings: [],
    info: 'Error al obtener la lista de productos',
    });
}
});

// Endpoint para obtener un producto por su ID
// Endpoint para obtener un producto por su ID
router.get('/products/:id', async (req, res) => {
const productId = req.params.id;

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

    const product = rows[0];

    return res.status(200).json({
    status: 1,
    data: product,
    warnings: [],
    info: 'Producto encontrado',
    });
} catch (err) {
    console.error(err);
    return res.status(500).json({
    status: 0,
    data: [],
    warnings: [],
    info: 'Error al obtener el producto',
    });
}
});


module.exports = router;
