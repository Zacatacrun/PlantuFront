const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const getIDs= require('../../../GetIDs');

// Función para obtener la lista de productos que cumplen con las condiciones especificadas
async function getProductList(type, searchTerm, category) {
    console.log(type, searchTerm, category);

  let query = 'SELECT * FROM plantas WHERE 1=1';

  // Si se especificó un tipo de producto, se agrega la condición correspondiente a la consulta
  
  /*if (type && type !== 'All') {
    
    query += ` AND categoria_id = '${type}'`;
  }*/

  // Si se especificó un término de búsqueda, se agrega la condición correspondiente a la consulta
  if (searchTerm) {
    query += ` AND (nombre LIKE '%${searchTerm}%' OR descripcion LIKE '%${searchTerm}%')`;
  }

  // Si se especificó una categoría, se agrega la condición correspondiente a la consulta
  if (category) {
    const categoria_id= await getIDs.getCategoryData(pool,category);
    query += ` AND categoria_id = ${categoria_id.id}`;
  }
  console.log(query);
  const rows = await pool.query(query);
  return rows;
}

// Endpoint para obtener una lista de productos que cumplen con las condiciones especificadas
router.get('/getProducts', async (req, res) => {
  const type = req.body.type;
  const searchTerm = req.body.searchTerm;
  const category = req.body.category;
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


module.exports = router;
