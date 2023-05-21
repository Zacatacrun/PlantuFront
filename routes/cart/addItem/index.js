const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/addItem', function(req, res, next) {
    res.render('index', { title: 'addItem' });
});

router.post('/addItem', [
  // Validación y sanitización de campos
  body('idUsuario')
    .notEmpty().withMessage('El campo id usuario es obligatorio')
    .isInt().withMessage('debe ser un número entero')
    .toInt(),
  body('idProducto')
    .notEmpty().withMessage('El campo id producto es obligatorio')
    .isInt().withMessage('debe ser un número entero')
    .toInt(),
  body('cantidad')
    .notEmpty().withMessage('El campo cantidad es obligatorio')
    .isInt().withMessage('debe ser un número entero')
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
    const { idUsuario, idProducto, cantidad } = req.body;

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
        const product = await pool.query('SELECT * FROM plantas WHERE id = ?', [idProducto]);
        if (product.length === 0) {
        return res.status(401).json({
            status: 0,
            data: [],
            warnings: ['Producto no encontrado'],
            info: 'Error interno, inténtalo de nuevo'
        });
        }

        const stock = product[0].stock;
        if (stock >= cantidad) {
        // Insertar el producto en el carrito
        await pool.query('INSERT INTO carro (usuario_id, planta_id, cantidad) VALUES (?, ?, ?)', [idUsuario, idProducto, cantidad]);
        await pool.query('UPDATE plantas SET stock = ? WHERE id = ?', [stock - cantidad, idProducto]);
        return res.status(200).json({
            status: 1,
            data: {},
            warnings: [],
            info: 'Producto almacenado en el carrito'
        });
    } else {
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['No hay suficiente stock'],
            info: 'Error interno, inténtalo de nuevo'
        });
    }
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