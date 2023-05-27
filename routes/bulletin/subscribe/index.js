const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const tokens = require('../../../tokens');
const { isEmail } = require('validator');
const sendEmail = require('../../../sendEmail');

router.post('/subscribe', async (req, res) => {
  const token = await tokens.validateToken(pool, req.body.token);
  if (!token) {
    return res.status(401).json({
      status: 0,
      data: [],
      warnings: ['No tienes permiso para realizar esta acción'],
      info: 'Error interno, intentalo de nuevo',
      token: req.body.token
    });
  }

  const email = req.body.email;

  // Validar que el correo sea válido
  if (!isEmail(email)) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['El correo electrónico no es válido'],
      info: 'Error interno, intentalo de nuevo',
      token: req.body.token
    });
  }

  // Validar que el correo no esté ya registrado
  pool.query('SELECT * FROM bulletin WHERE correo = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: ['Error interno en la base de datos'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }
    if (results.length > 0) {
      return res.status(409).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'ya estas suscrito a nuestro boletín',
        token: req.body.token
      });
    }

    // Insertar el nuevo usuario en la base de datos
    pool.query('INSERT INTO bulletin (correo) VALUES (?)', [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno en la base de datos'],
          info: 'Error interno, intentalo de nuevo',
          token: req.body.token
        });
      }

      const emailBody = "Estimado/a cliente,<br><br>Gracias por suscribirse a plantu, la plataforma líder en venta de plantas online. Estamos encantados de contar con usted como parte de nuestra comunidad de amantes de la naturaleza.<br><br>En plantu encontrará una gran variedad de plantas de calidad, desde las más exóticas hasta las más clásicas, y podrá comprarlas con total seguridad y comodidad desde su casa. Además, podrá acceder a ofertas exclusivas, consejos de cuidado y envíos gratuitos.<br><br>Esperamos que disfrute de su experiencia en plantu y que encuentre las plantas que más le gusten. Si tiene alguna duda o sugerencia, no dude en contactarnos.<br><br>Atentamente,<br>El equipo de plantu";
      const emailSubject = "¡Bienvenido/a a Plantu!";
      const merror = 'Error al enviar el correo electrónico de confirmación';

      sendEmail.SendEmail(email, emailSubject, emailBody, merror, res)
        .then((emailSent) => {
          if (!emailSent) {
            return res.status(409).json({
              status: 0,
              data: [],
              warnings: ["se ha producido un error al enviar el correo"],
              info: 'ya estas suscrito a nuestro boletín',
              token: req.body.token
            });
          } else {
            return res.status(201).json({
              status: 1,
              data: [],
              warnings: ["se ha enviado un correo de confirmación a tu correo electrónico"],
              info: 'Gracias por suscribirte a nuestro boletín',
              token: req.body.token
            });
          }
        })
        .catch((error) => {
          return res.status(500).json({
            status: 0,
            data: [],
            warnings: ['Error al enviar el correo'],
            info: 'Error interno, intentalo de nuevo',
            token: req.body.token
          });
        });
    });
  });
});

module.exports = router;
