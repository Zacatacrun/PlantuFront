const express = require('express');
const router = express.Router();
const pool = require('../../../database');

router.get('getUnit', async (req, res) => {
  try {

    // Obtener todas las categorías
    const categorias = await pool.query('SELECT * FROM categorias');

    // Lista para almacenar las plantas
    const plantasPorCategoria = [];

    for (const categoria of categorias) {
      // Obtener una planta aleatoria de la categoría
      const planta = await pool.query(
        `SELECT * FROM plantas WHERE categoria_id = ? ORDER BY RAND() LIMIT 1`,
        [categoria.id]
      );

      // Validar que se haya encontrado una planta
      if (planta.length === 0) {
        plantasPorCategoria.push(null);
        continue;
      }

      // Validar que la planta no se encuentre en otra categoría
      const plantaDuplicada = await pool.query(
        `SELECT * FROM plantas WHERE id != ? AND nombre = ? AND categoria_id != ?`,
        [planta[0].id, planta[0].nombre, categoria.id]
      );

      if (plantaDuplicada.length > 0) {
        plantasPorCategoria.push(null);
        continue;
      }

      // Agregar la planta a la lista
      plantasPorCategoria.push(planta[0]);
    }

    // Respuesta exitosa
    return res.status(200).json({
      status: 1,
      data: plantasPorCategoria,
      warnings: [],
      info: 'Lista de plantas por categoría'
    });
  } catch (err) {
    // Error en la base de datos
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: ['Error en la base de datos'],
      info: ''
    });
  }
});

module.exports = router;
