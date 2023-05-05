var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs');
var pool = require('../../../database');
var jwt = require('jsonwebtoken');
var { isEmail } = require('validator');

router.delete('/deleteAccount', async (req, res) => {
  const { user, password } = req.body;
  //imprimir req.body
  /*console.log(req.body);
  console.log(!user);
  console.log(password);
  console.log(!password);
  */
  if (!user || !password) {
    return res.json({
      status: 0,
      data: [],
      warnings: [],
      info: "Correo electrónico y contraseña son requeridos",
      token : "token_de_autenticacion",
    });
  }

  if (!isEmail(user)) {
    return res.json({
      status: 0,
      data: [],
      warnings: [],
      info: "Formato de correo electrónico inválido",
      token: "token_de_autenticacion",
    });
  }

  try {
    const query = 'SELECT id, nombre, correo, contraseña, rol FROM usuarios WHERE correo = ?';
    const [rows] = await pool.query(query, [user]);
   // console.log(rows);
   if (!rows || !Object.keys(rows).length) {
    return res.json({
      status: 0,
      data: [],
      warnings: [],
      info: "Correo electrónico no registrado",
      token: "token_de_autenticacion",
    });
  }

    const userObj = rows[0];
    // conseguir la contraseña del usuario
    const keys = Object.keys(rows);
    const passwordKey = keys.find((key) => key === "contraseña");
    const correo = keys.find((key) => key === "correo");
    const passwordUser = rows[passwordKey];
    //imprimir la contraseña 
   // console.log(password);
    const passwordMatches = bcryptjs.compareSync(password,passwordUser);
    if (!passwordMatches) {
      return res.json({
        status: 0,
        data: [],
        warnings: [],
        info: "Contraseña incorrecta",
        token: "token_de_autenticacion",  
      });
    }

    const deleteQuery = 'DELETE FROM usuarios WHERE correo = ?';
    await pool.query(deleteQuery, [rows[correo]]);

    return res.json({
      status: 1,
      data: [userObj],
      warnings: [],
      info: "Borrar usuario exitoso",
      token: "token_de_autenticacion",
    });
  } catch (err) {
    console.error(err);
    return res.json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error al borrar usuario del registro",
      token : "token_de_autenticacion",
    });
  }
});

module.exports = router;
