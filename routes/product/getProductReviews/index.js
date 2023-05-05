const express = require('express');
const router = express.Router();
const pool = require('../../../database');

// recibe como parámetro ID de la planta cuyos comentarios se quieren obtener
router.get('/getProductReviews', (req, res) => {
  const { id } = req.query;

  // Validar que el campo no esté vacío
  if (!id) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['Faltan campos obligatorios'],
      info: 'Error interno, intentalo de nuevo'
    });
  }

  // Validar que la planta exista
  pool.query('SELECT * FROM plantas WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: ['Error interno en la base de datos'],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: ['La planta no está registrada'],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    // Obtener los comentarios de la planta
    pool.query('SELECT * FROM comentarios WHERE id_planta = ?', [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno en la base de datos'],
          info: 'Error interno, intentalo de nuevo'
        });
      }

      const comentarios = results.map(({ id, id_usuario, comentario, valoracion, fecha_comentario }) => {
        return { id, id_usuario, comentario, valoracion, fecha_comentario };
      });

      return res.status(200).json({
        status: 1,
        data: comentarios,
        warnings: [],
        info: 'Comentarios obtenidos exitosamente'
      });
    });
  });
});

module.exports = router;