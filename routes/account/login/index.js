const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const pool = require("../../../database");
const tokens = require("../../../tokens");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
const { body, validationResult } = require("express-validator");
const axios = require("axios");

const ERROR_MESSAGES = {
  INTERNAL_ERROR: "Error interno, intentalo de nuevo",
  MISSING_FIELDS: "Faltan campos obligatorios",
  INVALID_CAPTCHA: "El captcha no es válido",
  USER_NOT_FOUND: "El usuario no está registrado",
  INVALID_PASSWORD: "Contraseña incorrecta",
  TOKEN_NOT_SAVED: "Error interno al guardar el token",
  TOKEN_NOT_VALID: "Error interno al validar el token",
  PASSWORD_VERIFICATION_ERROR: "Error interno al verificar la contraseña",
  DATABASE_ERROR: "Error interno en la base de datos",
};

const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const validateCaptcha = async (captchaToken) => {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    );
    return response.data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
};

router.post(
  "/login",
  [
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        status: 0,
        data: [],
        warnings: errors.array().map((e) => e.msg),
        info: ERROR_MESSAGES.INTERNAL_ERROR,
      });
    }

    const { user, password, captchaToken } = req.body;

    if (!user || !password || !captchaToken) {
      const errors =
        "Faltan campos:" +
        (!user ? " user" : "") +
        (!password ? " password" : "") +
        (!captchaToken ? " captchaToken" : "");
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        status: 0,
        data: [],
        warnings: [errors],
        info: ERROR_MESSAGES.INTERNAL_ERROR,
      });
    }

    const isEmailUser = isEmail(user);
    const queryUser = isEmailUser ? "correo" : "nombre";
    try {
      const captchaValid = await validateCaptcha(captchaToken);
      if (!captchaValid) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          status: 0,
          data: [],
          warnings: [ERROR_MESSAGES.INVALID_CAPTCHA],
          info: "Error validando captcha 🤖",
        });
      }

      const userObj = await pool.query(
        `SELECT * FROM usuarios WHERE ${queryUser} = ?`,
        [user]
      );
      if (userObj.length === 0) {
        return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          status: 0,
          data: [],
          warnings: [ERROR_MESSAGES.USER_NOT_FOUND],
          info: ERROR_MESSAGES.INTERNAL_ERROR,
        });
      }

      const token = await tokens.getToken(pool, userObj[0].id, queryUser);
      if (!token) {
        const newToken = jwt.sign(
          { user: userObj[0][queryUser] },
          "secretkey",
          { expiresIn: "1d" }
        );
        const tokenSaved = await tokens.saveToken(
          pool,
          userObj[0][queryUser],
          newToken
        );
        if (!tokenSaved) {
          return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            status: 0,
            data: [],
            warnings: [ERROR_MESSAGES.TOKEN_NOT_SAVED],
            info: ERROR_MESSAGES.INTERNAL_ERROR,
            token: "",
          });
        }
        return res.status(HTTP_STATUS_CODES.OK).json({
          status: 1,
          data: {
            id: userObj[0].id,
            nombre: userObj[0].nombre,
            correo: userObj[0].correo,
            rol: userObj[0].rol,
          },
          warnings: [],
          info: "Inicio de sesión exitoso",
          token: newToken,
        });
      } else {
        return res.status(HTTP_STATUS_CODES.OK).json({
          status: 1,
          data: {
            id: userObj[0].id,
            nombre: userObj[0].nombre,
            correo: userObj[0].correo,
            rol: userObj[0].rol,
          },
          warnings: [],
          info: "Inicio de sesión exitoso",
          token: token,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: 0,
        data: [],
        warnings: [ERROR_MESSAGES.DATABASE_ERROR, err.message],
        info: ERROR_MESSAGES.INTERNAL_ERROR,
      });
    }
  }
);

module.exports = router;
