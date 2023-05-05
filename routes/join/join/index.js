const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const pool = require('../../../database');
const { isEmail } = require('validator');

router.post('/join', (req, res) => {
  const { viveroName, viveroEmail } = req.body;

  // Validar campos obligatorios
  if (!viveroName || !viveroEmail) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['Faltan campos obligatorios'],
      info: 'Error enviando la solicitud, intentalo de nuevo'
    });
  }

  // Validar correo electrónico
  if (!isEmail(viveroEmail)) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['Correo electrónico inválido'],
      info: 'Error enviando la solicitud, intentalo de nuevo'
    });
  }

  // Verificar si el vivero ya está registrado
  pool.query(`SELECT * FROM viveros WHERE correo = ?`, [viveroEmail], (err, results) => {
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

    // Si todo está bien, registrar el vivero
    pool.query(`INSERT INTO viveros (nombre, correo) VALUES (?, ?)`, [viveroName, viveroEmail], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno en la base de datos'],
          info: 'Error enviando la solicitud, intentalo de nuevo'
        });
      }

      return res.status(200).json({
        status: 1,
        data: [],
        warnings: [],
        info: 'Tu solicitud ha sido enviada, nos contactaremos pronto contigo'
      });
    });
  });
});

module.exports = router;