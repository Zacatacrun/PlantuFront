const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// Crear pool de conexiones a la base de datos
const pool = mysql.createPool(require('../../../database'));
router.post('/join', (req, res) => {
/*
const { viveroName, viveroDescripcion,viveroVendedorID } = req.body;
const queryUsuario = `SELECT * FROM usuarios WHERE id=${viveroVendedorID}`;
// Obtener el ID del usuario
  pool.query(queryUsuario, (error, resultsUsuario) => {
    if (error) {
      console.error(error);
      return res.json({
        status: 0,
        data: [],
        warnings: ['Error en la base de datos'],
        info: 'Error enviando la solicitud, intentalo de nuevo'
      });
    }

if (resultsUsuario.length === 0) {
  return res.json({
    status: 0,
    data: [],
    warnings: ['El usuario ingresado no existe'],
    info: 'Error enviando la solicitud, intentalo de nuevo'
  });
}

const queryVivero = `SELECT * FROM viveros WHERE nombre='${viveroName}'`;
pool.query(queryVivero, (error, resultsVivero) => {
  if (error) {
    console.error(error);
    return res.json({
      status: 0,
      data: [],
      warnings: ['Error en la base de datos'],
      info: 'Error enviando la solicitud, intentalo de nuevo'
    });
  }

  if (resultsVivero.length > 0) {
    return res.json({
      status: 0,
      data: [],
      warnings: ['El nombre de vivero ingresado ya está en uso'],
      info: 'Error enviando la solicitud, intentalo de nuevo'
    });
  }

  // Registrar el vivero en la base de datos
  const insertQuery = `INSERT INTO viveros (nombre, descripcion, vendedor_id) VALUES ('${viveroName}', '${viveroDescripcion}', '${viveroVendedorID}')`;
  pool.query(insertQuery, (error, results) => {
    if (error) {
      console.error(error);
      return res.json({
        status: 0,
        data: [],
        warnings: ['Error en la base de datos'],
        info: 'Error enviando la solicitud, intentalo de nuevo'
      });
    }

    // Enviar respuesta exitosa
    return res.json({
      status: 1,
      data: {
        id: results.insertId,
        name: viveroName,
        descripcion: viveroDescripcion,
        vendedor_id: viveroVendedorID
      },
      warnings: [],
      info: 'Tu solicitud ha sido enviada, nos contactaremos pronto contigo'
    });
  });
});


});
*/
});

module.exports = router;