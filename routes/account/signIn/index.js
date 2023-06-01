const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { isEmail } = require("validator");
const mail = require("../../../SendEmail");

const ERROR_MESSAGES = {
  INTERNAL_ERROR: "Error interno, intentalo de nuevo",
  MISSING_FIELDS: "Faltan campos obligatorios",
  INVALID_EMAIL: "El correo no es válido",
  USER_ALREADY_REGISTERED: "El usuario ya se encuentra registrado",
  USER_ALREADY_PENDING_VALIDATION: "El usuario ya tiene una solicitud de validación pendiente",
  EMAIL_SENDING_ERROR: "Error al enviar el correo electrónico",
  EMAIL_PROVIDER_NOT_SUPPORTED: "El proveedor de correo electrónico no es compatible",
  VALIDATION_EMAIL_SENT: "Se ha enviado un correo electrónico de validación",
  DATABASE_ERROR: "Error interno en la base de datos"
};

router.post(
  "/signIn",
  [
    // Validación de campos
    body("name")
      .notEmpty()
      .withMessage("El campo name es obligatorio")
      .isString()
      .withMessage("El name debe ser una cadena de caracteres")
      .trim()
      .isLength({ max: 50 })
      .withMessage("El name no puede tener más de 50 caracteres")
      .escape(),
    body("email")
      .notEmpty()
      .withMessage("El campo correo es obligatorio")
      .isString()
      .withMessage("El correo debe ser una cadena de caracteres")
      .trim()
      .isLength({ max: 50 })
      .withMessage("La contraseña no puede tener más de 50 caracteres")
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("El campo contraseña es obligatorio")
      .isString()
      .withMessage("La contraseña debe ser una cadena de caracteres")
      .trim()
      .isLength({ max: 100 })
      .withMessage("La contraseña no puede tener más de 100 caracteres")
      .escape(),
    body("rol")
      .notEmpty()
      .withMessage("El campo rol es obligatorio")
      .isString()
      .withMessage("El rol debe ser una cadena de caracteres")
      .trim()
      .isLength({ max: 50 })
      .withMessage("El rol no puede tener más de 50 caracteres")
      .escape(),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: errors.array().map((e) => e.msg),
        info: ERROR_MESSAGES.MISSING_FIELDS,
      });
    }

    const { name, email, password, rol } = req.body;
    console.log(name, email, password, rol+"hola");
    if (!name || !email || !password || !rol) {
      //crea un mensaje de error indicando que faltan campos obligatorios
      const error= "Faltan campos: "  + (!name ? "name " : "") + (!email ? "email " : "") + (!password ? "password " : "") + (!rol ? "rol " : "");
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [error],
        info: ERROR_MESSAGES.MISSING_FIELDS,
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [ERROR_MESSAGES.INVALID_EMAIL],
        info: ERROR_MESSAGES.MISSING_FIELDS,
      });
    }

    try {
      const userExists = await pool.query(
        "SELECT * FROM usuarios WHERE correo = ?",
        [email]
      );
      if (userExists.length > 0) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [ERROR_MESSAGES.USER_ALREADY_REGISTERED],
          info: "Gracias por registrarse",
        });
      }

      const userPending = await pool.query(
        "SELECT * FROM porValidar WHERE correo = ?",
        [email]
      );
      if (userPending.length > 0) {
        return res.status(200).json({
          status: 0,
          data: [],
          warnings: [ERROR_MESSAGES.USER_ALREADY_PENDING_VALIDATION],
          info: "Gracias por registrarse",
        });
      }

      const token = jwt.sign({ email: email }, process.env.JW_SECRET, {
        expiresIn: "1h",
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);

      const asunto = "Solicitud de suscripción a Plantu";
      const mensaje = `<p><strong>Estimado usuario,</strong></p>
      <p>Gracias por tu interés en PLANT<span style="color:green">U</span>, la página de venta de plantas más verde y fresca del mercado. Para completar tu solicitud de suscripción, por favor ingresa el siguiente código de validación en nuestra página web:</p> <strong>${token}</strong></p>
      <p>Si no solicitaste una suscripción a PLANT<span style="color:green">U</span>, ignora este mensaje. No es necesario que valides tu sesión ni compartas el código con nadie.</p>
      <p>
      Saludos,</p>
      <p><strong>El equipo de PLANT<span style="color:green">U</span></strong></p>
      
      `;
      const merror = ERROR_MESSAGES.EMAIL_SENDING_ERROR;

      const emailSent = await mail.SendEmail(email, asunto, mensaje, merror, res);
      if (!emailSent) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [],
          info: ERROR_MESSAGES.EMAIL_PROVIDER_NOT_SUPPORTED,
        });
      }

      await pool.query(
        "INSERT INTO porValidar (nombre, correo, contraseña,rol,token) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, rol, token]
      );

      return res.status(200).json({
        status: 1,
        data: [],
        warnings: [],
        info: ERROR_MESSAGES.VALIDATION_EMAIL_SENT,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: [ERROR_MESSAGES.DATABASE_ERROR],
        info: ERROR_MESSAGES.INTERNAL_ERROR,
      });
    }
  }
);
module.exports = router;
