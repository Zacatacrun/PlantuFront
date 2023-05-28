const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../../database');
const tokens = require('../../../tokens');
const getIds = require('../../../GetIDs');

const { isEmail } = require('validator');

router.post('/join', async (req, res) => {
  const nombre = req.body.viveroName;
  const correo = req.body.viveroEmail;
  const descripcion = req.body.descripcion;
  const imagen = req.body.image;
  const token = req.body.token;
  if(tokens.validateToken(pool,token)){
    //valida que no falten campos obligatorios
    if (!nombre || !correo || !descripcion  || !token) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['Faltan campos obligatorios'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }
    const user = await getIds.getUserData(pool,token);
    //valida que el usuario exista y sea un usuario
    if(!user){
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['No se encontro el usuario'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }else if(user.rol!=="user"){
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['No tienes permitido para hacer esta accion, tu rol no lo permite'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }
    const vivero = await pool.query('SELECT * FROM viveros WHERE nombre=? AND vendedor_id=?',[nombre,user.id]);
    if(vivero.length>0){
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['Ya existe un vivero con ese nombre'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }
    else{
      //valida que el correo sea valido
      if(!isEmail(correo)){
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: ['El correo no es valido'],
          info: 'Error interno, intentalo de nuevo',
          token: req.body.token
        });
      
      }
      //dependiendo si se envio una imagen o no, se modifica el query
      let newVivero;
      if(!imagen){
         newVivero = {
          nombre:nombre,
          correo:correo,
          descripcion:descripcion,
          vendedor_id:user.id,
          aceptado:false
        };
      }
      else{
          newVivero = {
          nombre:nombre,
          correo:correo,
          descripcion:descripcion,
          imagen:imagen,
          vendedor_id:user.id,
          aceptado:false
        };
      }

      
      await pool.query('INSERT INTO viveros set ?', [newVivero]);
      const vivero = await pool.query('SELECT * FROM viveros WHERE nombre=? AND vendedor_id=?',[nombre,user.id]);
      if(vivero.length===0){
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: ['Error al crear el vivero'],
          info: 'Error interno al guardar los datos, intentalo de nuevo',
          token: req.body.token
        });
      }
      //se crea un registro en la tabla viverosPorValidar
      await pool.query('INSERT INTO viverosPorValidar (id_vivero) VALUES (?)', [vivero[0].id]);
      const viveroPorValidar = await pool.query('SELECT * FROM viverosPorValidar WHERE id_vivero=?',[vivero[0].id]);
      if(viveroPorValidar.length===0){
        console.log(viveroPorValidar);
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: ['Error al crear el vivero'],
          info: 'Error interno al guardar los datos, intentalo de nuevo',
          token: req.body.token
        });
      }

      return res.status(200).json({
        status: 1,
        data: [],
        warnings: [],
        info: 'Vivero creado con exito',
        token: req.body.token
      });
    }
  }
  else{
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['Token invalido'],
      info: 'acceso denegado, inicia sesion',
      token: req.body.token
    });
  }
  
});

module.exports = router;
