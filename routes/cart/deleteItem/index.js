const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { body, validationResult } = require('express-validator');

// Eliminar producto del carrito de compras
router.delete('/deleteItem', [
  // Validación y sanitización de campos
  body('idUsuario')
    .notEmpty().withMessage('El campo id usuario es obligatorio')
    .isInt().withMessage('Debe ser un número entero')
    .toInt(),
  body('idProducto')
    .notEmpty().withMessage('El campo id producto es obligatorio')
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

  const { idUsuario, idProducto } = req.body;

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

    // Verificar si el producto existe en el carrito
    const product = await pool.query('SELECT * FROM carro WHERE usuario_id = ? AND planta_id = ?', [idUsuario, idProducto]);
    if (product.length === 0) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: ['Producto no encontrado en el carrito'],
        info: 'Error interno, inténtalo de nuevo'
      });
    }

    // Eliminar el producto del carrito
    await pool.query('DELETE FROM carro WHERE usuario_id = ? AND planta_id = ?', [idUsuario, idProducto]);

    res.status(200).json({
      status: 1,
      data: {},
      warnings: [],
      info: 'Producto eliminado del carrito exitosamente'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: ['Error interno del servidor'],
      info: 'Error interno, inténtalo de nuevo'
    });
  }
});

module.exports = router;
