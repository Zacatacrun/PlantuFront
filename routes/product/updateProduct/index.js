const express = require('express');
const router = express.Router();
const pool = require('../../../database');

const image = require('../../../Image');
const getIds= require('../../../GetIDs');
const tokens = require('../../../tokens');
router.put('/updateProduct', async (req, res) => {
    const productId = req.body.id;
    const token = req.body.token;
    const precio = req.body.precio;
    const stock = req.body.stock;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const imagen = req.body.image;
    if (!req.body.id || !req.body.token) {
        return res.status(400).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Faltan datos obligatorios',
        });
    }
    const tokenUserId= await getIds.getUserId(pool, req.body.token);
    const productoActual = await pool.query('SELECT * FROM plantas WHERE id = ?', [productId]);
    if (!productoActual || !Object.keys(productoActual).length) {
        return res.status(404).json({
            status: 0,
            data: [],
            warnings: [],
            info: 'El producto no existe o no se encuentra disponible',
        });
    }
    const usuarioVivero= await getIds.getViveroData(pool, req.body.token);  
    if (!usuarioVivero || !Object.keys(usuarioVivero).length) {
        return res.status(404).json({
            status: 0,
            data: [],
            warnings: [],
            info: 'fallo al obtener el vivero',
        });
    }
    if((tokens.validateToken(pool, req.body.token) == false)||(tokenUserId!=usuarioVivero.vendedor_id)){
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: [],
            info: 'No tienes permiso para modificar este producto',
        });
    }
    try {
        let query = 'UPDATE plantas SET';
        if (!!imagen) { // Si la imagen no es nula
            query += ` imagen = '${imagen}',`;
        }

        if (precio) {
        query += ` precio = ${precio},`;
        }

        if (stock) {
        query += ` stock = ${stock},`;
        }

        if (nombre) {
        query += ` nombre = '${nombre}',`;
        }

        if (descripcion) {
        query += ` descripcion = '${descripcion}',`;
        }

        // Eliminar la coma final en caso de que haya alguna condición
        if (query.endsWith(',')) {
        query = query.slice(0, -1); // Eliminar la última coma
        }
        query += ` WHERE id = ${productId}`;
        await pool.query(query);
        const productoActualizado = await pool.query('SELECT * FROM plantas WHERE id = ?', [productId]);
        if (!productoActualizado || !Object.keys(productoActualizado).length) {
            return res.status(404).json({
                status: 0,
                data: [],
                warnings: [],
                info: 'Error interno, el producto no se pudo actualizar',
            });
        }
        return res.status(200).json({
            status: 1,
            data: {
                "antiguo":productoActual,
                "actual":productoActualizado
            },
            warnings: [],
            info: 'Producto actualizado correctamente',
        });
        // Verificar si el usuario es administrador
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 0,
            data: [],
            warnings: ['Error al actualizar el producto'],
            info: 'Error interno, intentalo de nuevo',
        });
    }
});

  module.exports = router;