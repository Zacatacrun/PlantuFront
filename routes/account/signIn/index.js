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

      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);

      const asunto = "Solicitud de suscripción a Plantu";
      const mensaje = `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Correo de Bienvenida</title>
        <style>
          /* Define CSS variables for colors, container width, etc. */
          :root {
            --primary-color: #00a859;
            --secondary-color: #333333;
            --background-color: #f8f8f8;
            --container-max-width: 600px;
          }
      
          /* Reset default margin, padding, and box-sizing */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
      
          /* Set the font family and background color for the body */
          body {
            font-family: Arial, sans-serif;
            background-color: var(--background-color);
          }
      
          /* Style the container that holds the email content */
          .container {
            max-width: var(--container-max-width);
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
      
          /* Center the header and add margin to the bottom */
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
      
          /* Style the heading with the primary color and add margin to the bottom */
          .header h1 {
            font-size: 24px;
            color: var(--primary-color);
            margin-bottom: 10px;
          }
      
          /* Style the main content with the secondary color and add margin to the bottom */
          .content {
            font-size: 18px;
            line-height: 1.5;
            color: var(--secondary-color);
            margin-bottom: 20px;
          }
      
          /* Style the call-to-action button with the primary color and add margin to the top */
          .cta-button {
            display: none;
          }
      
          /* Style the footer with the secondary color and add margin to the top */
          .footer {
            text-align: center;
            font-size: 16px;
            line-height: 1.5;
            color: var(--secondary-color);
            margin-top: 20px;
          }
      
          /* Style the token textbox */
          #token {
            display: block;
            margin: 0 auto;
            width: 80%;
            height: 50px;
            font-size: 20px;
            padding: 10px;
            border-radius: 5px;
            border: none;
            background-color: var(--primary-color);
            color: #000000;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <!-- Container that holds the email content -->
        <div class="container">
          <!-- Header with the logo and heading -->
          <header class="header">
            <h1>¡Hola, ${name}!</h1>
            <img
              src="https://res.cloudinary.com/dpcqhj8vk/image/upload/v1685679957/Logo_Circular_gsbx4o.jpg"
              alt="Logo de PLANTU"
              style="max-width: 150px;"
            />
          </header>
          <!-- Main content with the welcome message, call-to-action button, and additional information -->
          <main class="content">
            <p>
              Gracias por unirte a PLANT<span style="color: var(--primary-color);">U</span>, el oasis digital donde encontrarás las plantas más exuberantes y frescas del mercado. Para activar tu suscripción, te proporcionamos un código especial de bienvenida que debes ingresar en nuestro sitio web:
            </p>
            <textarea id="token" readonly>${token}</textarea>
            <br />
            <p>
              Si no solicitaste una suscripción a PLANT<span style="color: var(--primary-color);">U</span>, ignora este mensaje. Tu privacidad es importante para nosotros y no compartiremos tu información con terceros.
            </p>
            <p>¡No esperes más para sumergirte en el fascinante mundo de las plantas! Descubre nuestras ofertas exclusivas, consejos de cuidado y mucho más.</p>
          </main>
          <!-- Footer with the closing message and signature -->
          <footer class="footer">
            <p>¡Te esperamos con los brazos abiertos en PLANT<span style="color: var(--primary-color);">U</span>!</p>
            <p>Atentamente,</p>
            <p><strong>El equipo de PLANT<span style="color: var(--primary-color);">U</span></strong></p>
          </footer>
        </div>
      </body>
      </html>
      

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
