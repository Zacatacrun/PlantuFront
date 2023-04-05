var express = require('express');
var router = express.Router();
var pool = require('../../database');

/* GET home page. */
router.get('/subscribe', function(req, res, next) {
    pool.query("SELECT * FROM usuarios", (err, rows) => {
        if (err) {
            return res.json(err);
        }
        return res.json(rows);
    });
});
router.get('/usuarios', async (req, res) => {
    try {
      const usuarios = await pool.query('SELECT * FROM usuarios'); //Se realiza la consulta SQL para obtener todos los usuarios
      res.json(usuarios.rows); //Se devuelve la respuesta en formato JSON con la lista de usuarios
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener los usuarios' }); //En caso de error, se devuelve un mensaje de error en formato JSON
    }
  });
router.get("/", (req, res) => {
    //realiza una consulta a la base de datos sql
    
});
module.exports = router;

