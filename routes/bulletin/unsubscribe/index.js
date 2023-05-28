const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const validator = require('validator');
const tokens = require('../../../tokens');
const sendEmail = require('../../../SendEmail');
const getIds = require('../../../GetIDs');
// Endpoint para desuscribirse del boletín
router.delete('/unsubscribe', async(req, res) => {
  const token= await tokens.validateToken(pool,req.body.token);
  if (token)
  {
    // Obtener el correo electrónico del cuerpo de la solicitud
    let email= await getIds.getUserData(pool, req.body.token);
    email = email.correo;

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
        const emailSubject = "Lamentamos que hayas cancelado tu suscripción a Plantu";
        const emailBody = "Estimado/a cliente,<br><br>Lamentamos que hayas cancelado tu suscripción a Plantu, la plataforma líder en venta de plantas online. Apreciamos tu interés en nuestra comunidad de amantes de la naturaleza.<br><br>Recuerda que siempre puedes volver a suscribirte en cualquier momento para recibir nuestras ofertas exclusivas, consejos de cuidado y envíos gratuitos.<br><br>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estaremos encantados de ayudarte.<br><br>Gracias por tu atención y esperamos verte nuevamente en Plantu en el futuro.<br><br>Atentamente,<br>El equipo de Plantu";


        const merror = 'Error al enviar el correo electrónico de confirmación';
  
        sendEmail.SendEmail(email,emailSubject, emailBody, merror)
          .then((emailSent) => {
            if (!emailSent) {
              return res.status(409).json({
                status: 0,
                data: [],
                warnings: ["se ha producido un error al enviar el correo"],
                info: 'Solicitud para desuscribirte a nuestro boletín aprobada',
                token: req.body.token
              });
            } else {
              return res.status(200).json({
                status: 1,
                data: [],
                warnings: [],
                info: 'Solicitud para desuscribirte a nuestro boletín aprobada',
                token:req.body.token
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
        // Devolver una respuesta exitosa
        
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
