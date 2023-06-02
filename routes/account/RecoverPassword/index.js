const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const ERROR_MESSAGES = {
  INTERNAL_ERROR: "Error interno, inténtalo de nuevo",
  MISSING_FIELDS: "Faltan campos obligatorios",
  USER_NOT_FOUND: "Usuario no encontrado",
  DATABASE_ERROR: "Error interno en la base de datos"
};

router.post("/RecoverPassword", async (req, res) => {
  const { email, nuevaContrasena } = req.body;

  if (!email || !nuevaContrasena) {
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

  try {
    // Verificar si el usuario está autenticado
    const user = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    if (user.length === 0) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: ['Usuario no autenticado'],
        info: 'Error interno, inténtalo de nuevo'
      });
    }

    // Generar el hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    //console.log('Hashed Password:', hashedPassword);

    // Actualizar la contraseña en la base de datos
    await pool.query(
      "UPDATE usuarios SET contraseña = ? WHERE correo = ?",
      [hashedPassword, email]
    );

    return res.status(200).json({
      status: 1,
      data: [],
      warnings: [],
      info: "Contraseña actualizada exitosamente",
    });
  } catch (err) {
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [ERROR_MESSAGES.DATABASE_ERROR],
      info: ERROR_MESSAGES.INTERNAL_ERROR,
    });
  }
});

module.exports = router;