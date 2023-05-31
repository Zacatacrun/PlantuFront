const express = require("express");
const router = express.Router();
const pool = require("../../../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { isEmail } = require("validator");
const mail = require("../../../SendEmail");

/* GET home page. */
router.get("/signIn", function (req, res, next) {
  res.render("index", { title: "signIn" });
});

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
  function (req, res, next) {
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

    const { name, email, password, rol } = req.body;
    // Verificar que los campos no estén vacíos
    if (!name || !email || !password || !rol) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ["Faltan campos obligatorios"],
        info: "Error interno, intentalo de nuevo",
      });
    }

    // Validar que el correo sea válido
    if (!isEmail(email)) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ["El correo electrónico no es válido"],
        info: "Error interno, intentalo de nuevo",
      });
    }

    // Validar que el correo no esté ya registrado
    pool.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [email],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: 0,
            data: [],
            warnings: ["Error interno en la base de datos"],
            info: "Error interno, intentalo de nuevo",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            status: 0,
            data: [],
            warnings: ["El correo electrónico ya está registrado"],
            info: "Gracias por registrarce",
          });
        }

        // Validar que el correo no esté en la tabla porValidar
        pool.query(
          "SELECT * FROM porValidar WHERE correo = ?",
          [email],
          (err, results) => {
            if (err) {
              return res.status(500).json({
                status: 0,
                data: [],
                warnings: ["Error interno en la base de datos"],
                info: "Error interno, intentalo de nuevo",
              });
            }

            if (results.length > 0) {
              return res.status(200).json({
                status: 0,
                data: [],
                warnings: [
                  "El correo electrónico ya está en proceso de validación",
                ],
                info: "Gracias por registrarce",
              });
            }

            // Generar un token único y seguro
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });

            // Encriptar la contraseña
            bcrypt.hash(password, 10, function (err, hash) {
              if (err) {
                return res.status(500).json({
                  status: 0,
                  data: [],
                  warnings: ["Error interno al encriptar la contraseña"],
                  info: "Error interno, intentalo de nuevo",
                });
              }

              const expirationDate = new Date();
              expirationDate.setHours(expirationDate.getHours() + 1);

              const asunto = "Validacion de registro";
              const mensaje = `Tu código de validación de Plantu es: ${token}`;
              const merror =
                "Error al enviar el correo electrónico de confirmación";

              mail
                .SendEmail(email, asunto, mensaje, merror, res)
                .then((emailSent) => {
                  if (emailSent) {
                    // Insertar el nuevo usuario en la base de datos
                    pool.query(
                      "INSERT INTO porValidar (nombre, correo, contraseña,rol,token) VALUES (?, ?, ?, ?, ?)",
                      [name, email, hash, rol, token],
                      (err, results) => {
                        if (err) {
                          return res.status(500).json({
                            status: 0,
                            data: [],
                            warnings: ["Error interno en la base de datos"],
                            info: "Error interno, intentalo de nuevo",
                          });
                        }
                        res.status(200).json({
                          status: 1,
                          data: [],
                          warnings: [],
                          info: "Se ha enviado un correo de confirmación a tu dirección de correo electrónico",
                        });
                      }
                    );
                  } else {
                    res.status(400).json({
                      status: 0,
                      data: [],
                      warnings: [],
                      info: "Proveedor de correo electrónico no compatible",
                    });
                  }
                });
            });
          }
        );
      }
    );
  }
);

module.exports = router;
