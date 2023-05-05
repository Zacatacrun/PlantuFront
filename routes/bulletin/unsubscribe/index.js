const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const validator = require('validator');

// Endpoint para desuscribirse del boletín
router.delete('/unsubscribe', (req, res) => {
  // Obtener el correo electrónico del cuerpo de la solicitud
  const email = req.body.email;

  // Validar el correo electrónico
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error, correo electrónico inválido'
    });
  }

  // Verificar si el correo electrónico está registrado en la tabla "bulletin"
  pool.query('SELECT * FROM bulletin WHERE correo = ?', [email], (error, results) => {
    if (error) {
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    // Si el correo electrónico no está registrado, devolver un error
    if (results.length === 0) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error, el correo electrónico no está registrado'
      });
    }

    // Eliminar el correo electrónico de la tabla "bulletin"
    pool.query('DELETE FROM bulletin WHERE correo = ?', [email], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: [],
          info: 'Error interno, intentalo de nuevo'
        });
      }

      // Devolver una respuesta exitosa
      return res.status(200).json({
        status: 1,
        data: [],
        warnings: [],
        info: 'Solicitud para desuscribirte a nuestro boletín aprobada'
      });
    });
  });
});

module.exports = router;
