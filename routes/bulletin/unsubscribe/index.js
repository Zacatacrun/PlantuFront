var express = require('express');
var router = express.Router();
var pool = require('../../../database');
var validator = require('validator');
var tokens = require('../../../tokens');
// Endpoint para desuscribirse del boletín
router.delete('/unsubscribe', async(req, res) => {
  var token= await tokens.validateToken(pool,req.body.token);
  if (token)
  {
    // Obtener el correo electrónico del cuerpo de la solicitud
    var email = req.body.email;

    // Validar el correo electrónico
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error, correo electrónico inválido',
        token:req.body.token
      });
    }

    // Verificar si el correo electrónico está registrado en la tabla "bulletin"
    pool.query('SELECT * FROM bulletin WHERE correo = ?', [email], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: [],
          info: 'Error interno, intentalo de nuevo',
          token:req.body.token
        });
      }

      // Si el correo electrónico no está registrado, devolver un error
      if (results.length === 0) {
        return res.status(404).json({
          status: 0,
          data: [],
          warnings: [],
          info: 'Error, el correo electrónico no está registrado',
          token:req.body.token
        });
      }

      // Eliminar el correo electrónico de la tabla "bulletin"
      pool.query('DELETE FROM bulletin WHERE correo = ?', [email], (error, results) => {
        if (error) {
          return res.status(500).json({
            status: 0,
            data: [],
            warnings: [],
            info: 'Error interno, intentalo de nuevo',
            token:req.body.token
          });
        }

        // Devolver una respuesta exitosa
        return res.status(200).json({
          status: 1,
          data: [],
          warnings: [],
          info: 'Solicitud para desuscribirte a nuestro boletín aprobada',
          token:req.body.token
        });
      });
    });
  }
  else
  {
    return res.status(401).json({
      status: 0,
      data: [],
      warnings: ['No tienes permiso para realizar esta acción'],
      info: 'Error interno, intentalo de nuevo',
      token:req.body.token
    });
  }
}); 

module.exports = router;
