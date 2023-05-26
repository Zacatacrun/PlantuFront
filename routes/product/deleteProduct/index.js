const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const tokens = require('../../../tokens');
const getIds = require('../../../GetIDs');
const image = require('../../../Image');

router.delete('/deleteProduct', async (req, res) => {
  const productId = req.body.id;
  const token = req.body.token;

  if (!productId || !token) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Faltan datos obligatorios',
    });
  }

  try {
    const tokenUserId = await getIds.getUserId(pool, token);
    const productoActual = await pool.query('SELECT * FROM plantas WHERE id = ?', [productId]);

    if (!productoActual || !Object.keys(productoActual).length) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'El producto no existe o no se encuentra disponible',
      });
    }

    const usuarioVivero = await getIds.getViveroData(pool, token);

    if (!usuarioVivero || !Object.keys(usuarioVivero).length) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Fallo al obtener el vivero',
      });
    }

    if (
      (tokens.validateToken(pool, token) == false) ||
      (tokenUserId != usuarioVivero.vendedor_id)
    ) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'No tienes permiso para modificar este producto',
      });
    }

    // Eliminar la imagen asociada al producto si existe
    if (productoActual[0].imagen) {
      image.deleteImage(productoActual[0].imagen);
    }

    const borrado =await pool.query('DELETE FROM plantas WHERE id = ?', [productId]);

    return res.status(200).json({
      status: 1,
      data: [borrado],
      warnings: [],
      info: 'Producto eliminado correctamente',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: ['Error al eliminar el producto'],
      info: 'Error interno, intentalo de nuevo',
    });
  }
});

module.exports = router;
