var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs');
var pool = require('../../../database');
//manejo tokens en base de datos
var tokens = require('../../../tokens');
var jwt = require('jsonwebtoken');
var { isEmail } = require('validator');


router.post('/login', function(req, res, next) {
  const { user, password } = req.body;
  
  // Validar que los campos no estén vacíos
  if (!user || !password) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['Faltan campos obligatorios'],
      info: 'Error interno, intentalo de nuevo'
    });
  }

  // Validar si el usuario es un correo o un nombre de usuario
  const isEmailUser = isEmail(user);
  const queryUser = isEmailUser ? 'correo' : 'nombre';

  // Validar que el usuario esté registrado
  pool.query(`SELECT * FROM usuarios WHERE ${queryUser} = ?`, [user], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: ['Error interno en la base de datos'],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: ['El usuario no está registrado'],
        info: 'Error interno, intentalo de nuevo'
      });
    }

    // Verificar la contraseña
  
    
    const userObj = results[0];
    bcryptjs.compare(password, userObj.contraseña, function(err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno al verificar la contraseña'],
          info: 'Error interno, intentalo de nuevo'
        });
      }

      if (!result) {
        return res.status(401).json({
          status: 0,
          data: [],
          warnings: ['Contraseña incorrecta'],
          info: 'Error interno, intentalo de nuevo'
        });
      }

      // Generar el token de autenticación
      const token = jwt.sign({ user: userObj[queryUser] }, 'secretkey', { expiresIn: '1d' });
      // res error if token is not saved
      if (!tokens.saveToken(pool, userObj[queryUser], token)) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno al guardar el token'],
          info: 'Error interno, intentalo de nuevo',
          token:''
        });
      }
      return res.status(200).json({
        status: 1,
        data: [userObj],
        warnings: [],
        info: 'Inicio de sesión exitoso',
        token: token
      });
    });
  });
  
});

module.exports = router;