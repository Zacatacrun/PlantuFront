const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../../database');
const { isEmail } = require('validator');
const { body, validationResult } = require('express-validator');

async function SendAccountDeletedEmail(email, res) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'plantuapi@gmail.com',
        pass: 'aurarhgkyclcuieu'
      }
    });

    // Configurar el contenido del correo electrónico
    const info = await transporter.sendMail({
      from: 'My App <plantuapi@gmail.com>',
      to: email,
      subject: 'Eliminacion de cuenta',
      html: `Su cuenta ha sido eliminada exitosamente`
    });
    return true;
  } catch (error) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error al enviar el correo electrónico de confirmación',
    });
  }
}

// Borrar cuenta de usuario
router.delete('/deleteAccount', [
  // Validación de campos
  body('email')
    .notEmpty().withMessage('El campo name es obligatorio')
    .isString().withMessage('El name debe ser una cadena de caracteres')
    .trim()
    .isLength({ max: 50 }).withMessage('El name no puede tener más de 50 caracteres')
    .escape(),
  body('password')
    .notEmpty().withMessage('El campo contraseña es obligatorio')
    .isString().withMessage('La contraseña debe ser una cadena de caracteres')
    .trim()
    .isLength({ max: 100 }).withMessage('La contraseña no puede tener más de 100 caracteres')
    .escape()
], async (req, res) => {
  // Verificar si existen errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: errors.array().map(e => e.msg),
      info: 'Error interno, intentalo de nuevo'
    });
  }
  const {email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Correo electrónico y contraseña son requeridos"
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Formato de correo electrónico inválido"
    });
  }

  try{
    // Verificar si el usuario está autenticado
    const user = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    if (user.length === 0) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: ['Usuario no autenticado'],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    // Verificar que la contraseña proporcionada sea correcta
    const passwordMatch = await bcrypt.compare(password, user[0].contraseña);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: ['Contraseña incorrecta'],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    // Eliminar todas las filas relacionadas con el usuario en las tablas
    await Promise.all([
      pool.query('DELETE FROM usuarios WHERE correo = ?', [email]),
      pool.query('DELETE FROM bulletin WHERE correo = ?', [email]),
      pool.query('DELETE FROM viveros WHERE correo = ?', [email]),
      pool.query('DELETE FROM plantas WHERE vendedor_id = ?', [user[0].id]),
      pool.query('DELETE FROM transacciones WHERE comprador_id = ?', [user[0].id]),
      pool.query('DELETE FROM detalles_transaccion WHERE transaccion_id IN (SELECT id FROM transacciones WHERE comprador_id = ?)', [user[0].id]),
      pool.query('DELETE FROM carro WHERE usuario_id = ?', [user[0].id]),
      pool.query('DELETE FROM valoraciones WHERE usuario_id = ?', [user[0].id]),
      pool.query('DELETE FROM envios WHERE transaccion_id IN (SELECT id FROM transacciones WHERE comprador_id = ?)', [user[0].id]),
      pool.query('DELETE FROM soporte WHERE usuario_id = ?', [user[0].id]),
      pool.query('DELETE FROM mensajes WHERE id_usuario_emisor = ? OR id_usuario_receptor = ?', [user[0].id, user[0].id]),
      pool.query('DELETE FROM favoritos WHERE id_usuario = ?', [user[0].id]),
      pool.query('DELETE FROM compras WHERE usuario_id = ?', [user[0].id]),
      pool.query('DELETE FROM comentarios WHERE id_usuario = ?', [user[0].id]),
      pool.query('DELETE FROM redes_sociales WHERE id_usuario = ?', [user[0].id]),
    ]);

    const notificationSent = await SendAccountDeletedEmail(email);
    if (!notificationSent) {
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error al enviar la notificación de eliminación de cuenta por correo electrónico',
      });
    }

    res.status(200).json({
      status: 1,
      data: [],
      warnings: [],
      info: 'Cuenta eliminada exitosamente',
    });
  } catch(error){
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error interno, intentalo de nuevo"
    });
  }
});

module.exports = router;