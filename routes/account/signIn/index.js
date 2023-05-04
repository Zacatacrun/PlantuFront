const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');

/* GET home page. */
router.get('/signIn', function(req, res, next) {
  res.render('index', { title: 'signIn' });
});

router.post('/signIn', function(req, res, next) {
  const { name, email, password, rol } = req.body;
  // Verificar que los campos no estén vacíos
  if (!name || !email || !password || !rol) {
    return res.json({
        status: 0,
        data: [],
        warnings: ['Faltan campos obligatorios'],
        info: 'Error interno, intentalo de nuevo'
    });
  }

  // Validar que el correo sea válido
  if (!isEmail(email)) {
    return res.json({
        status: 0,
        data: [],
        warnings: ['El correo electrónico no es válido'],
        info: 'Error interno, intentalo de nuevo'
    });
  }

  // Validar que el correo no esté ya registrado
  pool.query('SELECT * FROM usuarios WHERE correo = ?', [email], (err, results) => {
    if (err) {
        return res.json({
            status: 0,
            data: [],
            warnings: ['Error interno en la base de datos'],
            info: 'Error interno, intentalo de nuevo'
        });
    }

    if (results.length > 0) {
        return res.json({
            status: 0,
            data: [],
            warnings: ['El correo electrónico ya está registrado'],
            info: 'Gracias por registrarce'
        });
    }

    // Encriptar la contraseña
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
          return res.json({
              status: 0,
              data: [],
              warnings: ['Error interno al encriptar la contraseña'],
              info: 'Error interno, intentalo de nuevo'
          });
      }

      // Insertar el nuevo usuario en la base de datos
      pool.query('INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)', [name, email, hash, rol], (err, results) => {
          if (err) {
              return res.json({
                  status: 0,
                  data: [],
                  warnings: ['Error interno en la base de datos'],
                  info: 'Error interno, intentalo de nuevo'
              });
          }

          // Generar el token de autenticación
          const token = jwt.sign({ email: email }, 'secretkey', { expiresIn: '1h' });

          return res.json({
              status: 1,
              data: [],
              warnings: [],
              info: 'Registro exitoso',
              token: token
          });
      });
    });
  });
});

module.exports = router;
