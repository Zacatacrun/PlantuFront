var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs');
const pool = require('../../../database');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', async (req,res)=>{
  const user = req.body.nombre;
  const pasword = req.body.contraseña;
  //verificar que los datos no esten vacios, verfificar el formato valido del correo, verificar que el correo no este registrado, verficar que la contraseña sea correcta
  let passwordHash = await bcryptjs.hash(pasword, 10);
  if(user && pasword){
    pool.query('SELECT * FROM usuarios WHERE nombre = ?', [user], async (err, result) => {
      if(result.length == 0 || !(await bcryptjs.compare(pasword, result[0].contraseña))){
        res.send('Usuario o contraseña incorrectos');
      }else{
        res.send('Bienvenido');
      }
    })
  }
});


module.exports = router;
