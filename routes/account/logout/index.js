const express = require('express');
const router = express.Router();

router.post('/logout', async (req, res) => {
  const id = req.params.id;


  // Realizar el logout
  try {
    // Realizar acciones necesarias para cerrar sesión
    // ...

    return res.json({
      status: 1,
      data: [],
      warnings: [],
      info: 'Logout exitoso'
    });
  } catch (err) {
    console.error(err);
    return res.json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error de logout'
    });
  }
});

module.exports = router;
