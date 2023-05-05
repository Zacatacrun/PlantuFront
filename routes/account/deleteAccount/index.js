var express = require('express');
var router = express.Router();
var bcryptjs = require('bcryptjs');
var pool = require('../../../database');
var { isEmail } = require('validator');
/*
⠀⠀⠀⢰⣢⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⡟⠈⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣶⣤⣀⠀⢀⣴⣾⣿⣷⣯⣳⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⡞⡷⢰⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⠿⠷⠿⠿⠿⠿⠟⠛⠋⠉⠉⠉⠉⠉⠉⠉⠙⢿⣾⠛⢯⣷⠹⢾⣷⣄⠀⣀⣴⣿⠿⠀⠀⠀⠀⠀
⠀⢸⣼⡇⠸⢺⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣢⣤⣤⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⡛⠀⠈⣯⣧⠀⠙⠻⠛⠷⠋⠁⠀⠀⠀⠀⠀⠀
⠀⠈⢷⣤⣴⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠴⡿⣿⣿⣿⣿⣿⣿⣿⠟⠉⣠⣼⣋⣿⣿⣿⣿⣿⣿⡄⠀⠹⡝⣆⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣗⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⣦⣾⣇⣮⣟⣋⠉⠉⠛⠻⢄⠐⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠙⠓⠛⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡇⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣯⠞⢻⣩⠍⠀⠀⠀⠀⠀⠉⢭⣀⣀⠘⡝⠻⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡇⡇⠀⠀⠀⠀⠀⣀⣠⣤⣤⣤⣼⣿⣦⣄⡑⢤⣀⣀⣀⠤⠒⠋⠁⢈⠀⣉⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣇⡇⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⡀⠀⠀⠀⣀⣠⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀
⠀⠀⠀⢸⡀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⣿⡿⢗⢲⡄⠀⠀
⠀⠀⠀⡼⡷⢾⣿⣿⠿⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠸⡥⠖⠺⠳⡀⠀
⠀⠀⢀⣇⠗⢤⣻⠁⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢸⣁⠀⡠⣗⠳⡄
⠀⣠⣻⡸⠀⡀⢹⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⡝⠿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⢡⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠈⢇⢦⢹⠑⠿
⢠⣫⣇⡟⡚⣡⠞⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠈⠉⠉⠉⠉⠉⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠈⠉⠛⠀⠀
⠘⣹⢸⡼⠽⠃⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⣀⣀⢀⣀⣀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⡿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⡇⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/
router.delete('/deleteAccount', async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Correo electrónico y contraseña son requeridos"
    });
  }

  if (!isEmail(user)) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Formato de correo electrónico inválido"
    });
  }

  try {
    const query = 'SELECT id, nombre, correo, contraseña, rol FROM usuarios WHERE correo = ?';
    const [rows] = await pool.query(query, [user]);

    if (!rows || !Object.keys(rows).length) {
      return res.status(404).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Correo electrónico no registrado"
      });
    }

    const userObj = rows[0];

    // Comparar la contraseña del usuario con la contraseña proporcionada
    const passwordKey = Object.keys(rows).find(key => key === "contraseña");
    const passwordUser = rows[passwordKey];
    const passwordMatches = bcryptjs.compareSync(password, passwordUser);
    if (!passwordMatches) {
      return res.status(401).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Contraseña incorrecta"
      });
    }

    const deleteQuery = 'DELETE FROM usuarios WHERE correo = ?';
    await pool.query(deleteQuery, [user]);

    return res.status(200).json({
      status: 1,
      data: [rows],
      warnings: [],
      info: "Borrar usuario exitoso"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [],
      info: "Error al borrar usuario del registro"
    });
  }
});

module.exports = router;
