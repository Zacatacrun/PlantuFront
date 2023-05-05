var express = require('express');
var router = express.Router();
const pool = require('../../../database');
const { isEmail } = require('validator');

/* GET home page. */
router.get('/getItems', function(req, res, next) {
  res.render('index', { title: 'getItems' });
});

router.post('/getItems', function(req, res, next) {
  const {user} = req.body;
  const queryUser = 'nombre'; // campo utilizado para consultar al usuario

  // Validar que el campo no esté vacío
  if (!user) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['Faltan campos obligatorios'],
      info: 'Error interno, intentalo de nuevo'
    });
  }

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
    
    // Obtener los productos del carrito
    pool.query(`SELECT carro.planta_id FROM carro JOIN plantas ON carro.planta_id = plantas.id WHERE carro.usuario_id = ?`, [results[0].id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno en la base de datos'],
          info: 'Error interno, intentalo de nuevo'
        });
      }

      // Validar que existan productos asociados al usuario
      if (results.length === 0) {
        return res.status(200).json({
          status: 1,
          data: [],
          warnings: [],
          info: 'El usuario no tiene productos en su carrito'
        });
      }

      // Devolver los productos obtenidos
      const productos = results.map((row) => row.planta_id);
      return res.status(200).json({
        status: 1,
        data: productos,
        warnings: [],
        info: 'Operación exitosa'
      });
    });
  });
});

module.exports = router;