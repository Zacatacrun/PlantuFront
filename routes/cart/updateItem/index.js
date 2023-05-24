const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { body, validationResult } = require('express-validator');

// Obtener lista de productos del carrito
router.get('/getItems', function(req, res, next) {
  res.render('index', { title: 'updateItem' });
});

router.post('/getItems', [
  // Validación y sanitización de campos
  body('idUsuario')
    .notEmpty().withMessage('El campo id usuario es obligatorio')
    .isInt().withMessage('Debe ser un número entero')
    .toInt(),
  body('*').trim().escape(),
], async (req, res) => {
  // Verificar si existen errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: errors.array().map(e => e.msg),
      info: 'Error interno, inténtalo de nuevo'
    });
  }

  const { idUsuario } = req.body;

  try {
    // Verificar si el usuario está autenticado
    const user = await pool.query('SELECT * FROM usuarios WHERE id = ?', [idUsuario]);
    if (user.length === 0) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: ['Usuario no autenticado'],
        info: 'Error interno, inténtalo de nuevo'
      });
    }

    // Obtener la lista de productos del carrito asociados al usuario
    const productos = await pool.query(
      `SELECT p.*
      FROM plantas p
      INNER JOIN carro c ON p.id = c.planta_id
      WHERE c.usuario_id = ?`,
      [idUsuario]
    );

    if (productos.length === 0) {
      return res.json({
        status: 0,
        data: [],
        info: 'No hay productos en el carrito',
        warnings: []
      });
    } else {
      return res.status(200).json({
        status: 1,
        data: productos,
        warnings: [],
        info: 'Lista de productos del carrito'
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: ['Error interno en la base de datos'],
      info: 'Error interno, inténtalo de nuevo'
    });
  }
});

module.exports = router;
