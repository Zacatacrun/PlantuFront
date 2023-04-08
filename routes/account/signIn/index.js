var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs');
const pool = require('../../../database');
/* GET home page. */
router.get('/singIn', function(req, res, next) {
  res.render('signIn');
});

router.post('/singIn', async (req, res, next)=> {
  const nombre = req.body.nombre;
  const password = req.body.contrasena;
  const correo = req.body.correo;
  const rol = req.body.rol;
  let passwordHash = await bcryptjs.hash(password, 10);
  //verificar que los datos no esten vacios, verfificar el formato valido del correo, verificar que el correo no este registrado
  pool.query('INSERT INTO usuarios (nombre, password, correo, rol) VALUES ($1, $2, $3, $4)', [nombre, passwordHash, correo, rol], (err, result) => {
    if (err) {
      console.log(err);
      res.send('error de registro');
    }
    res.send('registro exitoso');
  });
});

module.exports = router;
