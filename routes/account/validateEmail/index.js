const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../../../database');
const { isEmail } = require('validator');
const nodemailer = require('nodemailer');

router.get('/validateEmail/:token', async function(req, res, next) {
  const { token } = req.params;
  try {
    // Decodificar el token y extraer el correo electrónico
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;
    
    // Obtener la fecha de creación del token
    const creationDate = new Date(decodedToken.iat * 1000);
    const expirationDate = new Date(decodedToken.exp * 1000);

    // Verificar que la dirección de correo electrónico sea válida
    if (!isEmail(email)) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['La dirección de correo electrónico no es válida'],
        info: 'Error interno, inténtalo de nuevo'
      });
    }
    // Buscar la dirección de correo electrónico en la tabla porValidar
    pool.query('SELECT * FROM porValidar WHERE correo = ?', [email], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno en la base de datos'],
          info: 'Error interno, inténtalo de nuevo'
        });
      }

      // Verificar que se encontró la dirección de correo electrónico en la tabla porValidar
      if (results.length === 0) {
        return res.status(404).json({
          status: 0,
          data: [],
          warnings: ['La dirección de correo electrónico no está registrada para validación'],
          info: 'Error interno, inténtalo de nuevo'
        });
      }

      // Verificar que el token sea válido
      if (token !== results[0].token) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: ['El token no es válido'],
          info: 'Error interno, inténtalo de nuevo'
        });
      }
      
      // Verificar que el token no haya expirado
      if (expirationDate - creationDate > 3600000) {
        //Si el token ha expirado, actualizar el token en la tabla y enviar un nuevo correo al usuario
        const newToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        pool.query('UPDATE porValidar SET token = ? WHERE correo = ?', [newToken, email], (err, results) => {
          if (err) {
            return res.status(500).json({
                status: 0,
                data: [],
                warnings: ['Error interno en la base de datos'],
                info: 'Error interno, intentalo de nuevo'
            });
          }
          //Enviar el correo electrónico al usuario con el nuevo token
          sendEmail(email, `Nuevo enlace de confirmación. Tu enlace de confirmación ha caducado. Por favor, haz clic en el siguiente enlace para confirmar tu registro antes de ${expirationDate.toLocaleString()}: <a href="http://localhost:5173/validateEmail/${newToken}">validar cuenta</a>`);
          return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['El enlace ha caducado. Por favor, solicita un nuevo enlace de confirmación.'],
            info: 'Error interno, inténtalo de nuevo'
          });
        });
      }

      // Agregar el usuario a la tabla de usuarios
      pool.query('INSERT INTO usuarios (nombre, correo, password) SELECT nombre, correo, password FROM porValidar WHERE correo = ?', [email], (err, results) => {
        if (err) {
          return res.status(500).json({
              status: 0,
              data: [],
              warnings: ['Error interno en la base de datos'],
              info: 'Error interno, intentalo de nuevo'
          });
        }

        // Borrar el registro de la tabla porValidar
        pool.query('DELETE FROM porValidar WHERE correo = ?', [email], (err, results) => {
          if (err) {
            return res.status(500).json({
                status: 0,
                data: [],
                warnings: ['Error interno en la base de datos'],
                info: 'Error interno, intentalo de nuevo'
            });
          }
        // Responder con un mensaje de éxito
          res.status(200).json({
            status: 1,
            data: [],
            warnings: [],
            info: 'Tu cuenta ha sido validada correctamente'
          });
        });
      });
    });
  } catch (error) {
    // El token no es válido
    res.status(400).json({
      status: 0,
      data: [],
      warnings: ['El enlace no es válido'],
      info: 'Error interno, intentalo de nuevo'
    });
  }
});

module.exports = router;
