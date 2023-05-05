const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { isEmail } = require('validator');

router.put('/products/:id', async (req, res) => {
const productId = req.params.id;
const userId = req.body.usuario_id;
const userRole = req.body.rol;
const updatedProductData = req.body.updatedProduct;

try {
    // Verificar si el usuario es administrador
    const [userRows] = await pool.query('SELECT * FROM usuarios WHERE id = ? AND rol = "vivero"', [userId]);

    if (!userRows || !Object.keys(userRows).length) {
    return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Solo el administrador puede editar productos',
    });
    }

    // Obtener el producto a editar
    const [oldProductRows] = await pool.query('SELECT * FROM plantas WHERE id = ?', [productId]);

    if (!oldProductRows || !Object.keys(oldProductRows).length) {
    return res.status(404).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'El producto no existe',
    });
    }

    const oldProductData = oldProductRows[0];

    // Actualizar el producto
    await pool.query('UPDATE plantas SET ? WHERE id = ?', [updatedProductData, productId]);

    // Obtener el producto actualizado
    const [newProductRows] = await pool.query('SELECT * FROM plantas WHERE id = ?', [productId]);

    if (!newProductRows || !Object.keys(newProductRows).length) {
    return res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error al obtener el producto actualizado',
    });
    }

    const newProductData = newProductRows[0];

    return res.status(200).json({
    status: 1,
    data: {
        old: oldProductData,
        new: newProductData,
    },
    warnings: [],
    info: 'Producto actualizado exitosamente',
    });
} catch (err) {
    console.error(err);
    return res.status(500).json({
    status: 0,
    data: [],
    warnings: [],
    info: 'Error al actualizar el producto',
    });
}
});

  module.exports = router;