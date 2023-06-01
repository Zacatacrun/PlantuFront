const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const pool = require("../../../database");
//manejo tokens en base de datos
const tokens = require("../../../tokens");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
const { body, validationResult } = require("express-validator");
const axios = require("axios");

router.post(
  "/login",
  [
    // Validación de campos utilizando express-validator
    body("user")
      .notEmpty()
      .withMessage("El campo usuario es obligatorio")
      .isString()
      .withMessage("El usuario debe ser una cadena de caracteres")
      .trim()
      .isLength({ max: 50 })
      .withMessage("El usuario no puede tener más de 50 caracteres")
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("El campo contraseña es obligatorio")
      .isString()
      .withMessage("La contraseña debe ser una cadena de caracteres")
      .trim()
      .isLength({ max: 100 })
      .withMessage("La contraseña no puede tener más de 50 caracteres")
      .escape(),
  ],
  async (req, res) => {
    // Verificar si existen errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: errors.array().map((e) => e.msg),
        info: "Error interno, intentalo de nuevo",
      });
    }

    const { user, password, captchaToken } = req.body;

    // Validar que los campos no estén vacíos
    if (!user || !password || !captchaToken) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ["Faltan campos obligatorios"],
        info: "Error interno, intentalo de nuevo",
      });
    }

    try {
      // Sending secret key and response token to Google Recaptcha API for authentication.
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
      );

      // Check response status and send back to the client-side
      if (!response.data.success) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: ["Faltan campos obligatorios"],
          info: "Error validando captcha 🤖",
        });
      }
    } catch (error) {
      // Handle any errors that occur during the reCAPTCHA verification process
      console.error(error);
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: ["Faltan campos obligatorios"],
        info: "Error interno, intentalo de nuevo 🤖",
      });
    }

    // Validar si el usuario es un correo o un nombre de usuario
    const isEmailUser = isEmail(user);
    const queryUser = isEmailUser ? "correo" : "nombre";
    let userObj = await pool.query(
      `SELECT * FROM usuarios WHERE ${queryUser} = ?`,
      [user]
    );
    if (userObj.length === 0) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: ["El usuario no está registrado"],
        info: "Error interno, intentalo de nuevo",
      });
    }
    let token = await pool.query(`SELECT * FROM tokens WHERE usuario_id = ?`, [
      userObj[0].id,
    ]);
    // Validar que el usuario esté registrado
    pool.query(
      `SELECT * FROM usuarios WHERE ${queryUser} = ?`,
      [user],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: 0,
            data: [],
            warnings: ["Error interno en la base de datos"],
            info: "Error interno, intentalo de nuevo",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: 0,
            data: [],
            warnings: ["El usuario no está registrado"],
            info: "Error interno, intentalo de nuevo",
          });
        }

        // Verificar la contraseña
        userObj = results[0];
        bcryptjs.compare(password, userObj.contraseña, function (err, result) {
          if (err) {
            console.error(err);
            return res.status(500).json({
              status: 0,
              data: [],
              warnings: ["Error interno al verificar la contraseña"],
              info: "Error interno, intentalo de nuevo",
            });
          }

          if (!result) {
            return res.status(401).json({
              status: 0,
              data: [],
              warnings: ["Contraseña incorrecta"],
              info: "Error interno, intentalo de nuevo",
            });
          }

          // Generar el token de autenticación

          if (
            token.length == 0 ||
            !tokens.validateToken(pool, token[0].token)
          ) {
            token = jwt.sign({ user: userObj[queryUser] }, "secretkey", {
              expiresIn: "1d",
            });
            // res error if token is not saved
            if (!tokens.saveToken(pool, userObj[queryUser], token)) {
              return res.status(500).json({
                status: 0,
                data: [],
                warnings: ["Error interno al guardar el token"],
                info: "Error interno, intentalo de nuevo",
                token: "",
              });
            }
          } else {
            token = token[0].token;
          }
          return res.status(200).json({
            status: 1,
            data: {
              id: userObj.id,
              nombre: userObj.nombre,
              correo: userObj.correo,
              rol: userObj.rol,
            },
            warnings: [],
            info: "Inicio de sesión exitoso",
            token: token,
          });
        });
      }
    );
  }
);

module.exports = router;
module.exports = router;
