const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { validateToken } = require('../../../tokens');

// Agregar un nuevo usuario
router.post('/getUserFromToken', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      status: 0,
      data: [],
      info: 'Debes proporcionar un token',
    });
  }

  const tokenExists = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);

  if (!tokenExists) {
    return res.status(400).json({
      status: 0,
      data: [],
      info: 'El token no es válido',
    });
  }


  try {
    const usuarioId = await pool.query('SELECT usuario_id FROM tokens WHERE token = ?', [token]);
    const usuario = await pool.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?', [usuarioId[0].usuario_id]);

    return res.status(200).json({
      status: 1,
      data: usuario,
      info: 'Usuario obtenido correctamente',
    });
  }
  catch (error) {
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al obtener el usuario',
    });
  }
});

module.exports = router;
