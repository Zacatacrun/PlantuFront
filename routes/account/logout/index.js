const express = require('express');
const router = express.Router();
const token = require('../../../tokens');
const pool = require('../../../database');

router.post('/logout', async (req, res) => {
  console.log(req.body);
  const token0 = token.validateToken(pool, req.body.token);
  console.log(token0 + "token");
  if (token0) {
    const deleteToken = await token.deleteToken(pool, req.body.token);
    if (!deleteToken) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error de logout, no se pudo eliminar el token',
        token: req.body.token
      });
    }
    const id = req.body.id;

    // Realizar el logout
    try {
      // Realizar acciones necesarias para cerrar sesión
      // ...

      return res.status(200).json({
        status: 1,
        data: [],
        warnings: [],
        info: 'Logout exitoso',
        token: req.body.token
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error de logout, no se pudo cerrar sesión',
        token: req.body.token
      });
    }
  } else {
    return res.status(401).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error de logout, acceso denegado',
      token: req.body.token
    });
  }
});

module.exports = router;
