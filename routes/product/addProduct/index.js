const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../../database');
//manejo tokens en base de datos
const tokens = require('../../../tokens');
const imagenes = require('../../../Image');
const getId  = require('../../../GetIDs');
const jwt = require('jsonwebtoken');
router.post('/prueba', async (req, res) => {
  const x=await getId.getUserData(pool,req.body.token);
  console.log(x);
});
// POST /product/addProduct valida con token validate vivero
router.post('/addProduct', async (req, res) => {
  const usuario_id=await getId.getUserId(pool,req.body.token);
  if(!usuario_id){
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['No se encontro el usuario'],
      info: 'Error interno, intentalo de nuevo',
      token: req.body.token
    });
  }
  const vivero_id=await getId.getViveroId(pool,req.body.token);
  if(!vivero_id){
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: ['No se encontro el vivero'],
      info: 'Error interno, intentalo de nuevo',
      token: req.body.token
    });
  }
  const token0 = await tokens.validateToken(pool, req.body.token);
  //imprime los archivos
  if (token0) {
    const name=req.body.nombre;
    const description=req.body.descripcion;
    const price=req.body.precio;
    const stock=req.body.stock;
    const id_category=req.body.id_categoria;
    if(!name || !description || !price || !stock || !id_category ){
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['Faltan campos obligatorios'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }
    const producto= await pool.query('SELECT * FROM plantas WHERE nombre=? AND vivero_id=?',[name,vivero_id]);
    if(producto.length>0){
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['Ya existe un producto con ese nombre'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
      });
    }
    
    if(!(!req.files))
    {
      const image = req.files.image;
      const imagen = imagenes.uploadImage(image);
      if (!imagen) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: ['Error al subir la imagen'],
          info: 'Error interno, intentalo de nuevo',
          token: req.body.token
        });
      }
      pool.query('INSERT INTO plantas (nombre, descripcion, precio, stock,imagen, vendedor_id, categoria_id, vivero_id) VALUES (?,?,?,?,?,?,?,?)', [name, description, price, stock,imagen,usuario_id, id_category,vivero_id], async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            status: 0,
            data: [],
            warnings: ['Error al registrar el producto'],
            info: 'Error interno, intentalo de nuevo',
            token: req.body.token
          });
        }
        const id_product = results.insertId;
        //validar que se haya insertado
        if (id_product) {
          return res.status(200).json({
            status: 1,
            data: [],
            warnings: [],
            info: 'Producto registrado correctamente',
            token: req.body.token
          });
        
        } 
      });
    } 
    pool.query('INSERT INTO plantas (nombre, descripcion, precio, stock, vendedor_id, categoria_id, vivero_id) VALUES (?,?,?,?,?,?,?)', [name, description, price, stock,usuario_id, id_category,vivero_id], async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error al registrar el producto'],
          info: 'Error interno, intentalo de nuevo',
          token: req.body.token
        });
      }
      const id_product = results.insertId;
      //validar que se haya insertado
      if (id_product) {
        return res.status(200).json({
          status: 1,
          data: [],
          warnings: [],
          info: 'Producto registrado correctamente',
          token: req.body.token
        });
      
      } 
    });
  } else {
    return res.status(401).json({
      status: 0,
      data: [],
      warnings: [],
      info: 'Error de logout, acceso denegado',
      token: req.body.token
    });
  }
});
  //realiza la consulta
module.exports = router;
/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠠⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀⠠⠐⠀
⡀⠄⠀⡀⠠⠀⠀⡀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⡀⠄⠀⠠⠀⠀⡀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀⠄⠀⠀
⠀⠀⢀⠀⠀⠠⠀⠀⠀⡀⠂⠀⡀⠁⠀⠀⠁⠀⠀⠁⠀⡀⠁⢀⢀⣡⣴⣴⡶⣶⡷⣷⣶⣦⣤⡀⠀⠂⢀⠀⠁⠀⡀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁⠀⠀⠁
⠐⠈⠀⠀⠈⠀⢀⠈⠀⠀⢀⠀⢀⠀⠈⠀⠈⠀⠁⠀⠁⢀⣔⡷⣟⢯⡳⣕⢯⣺⣪⡳⣕⢯⣻⣻⣷⣄⠀⠠⠀⠁⠀⠀⠈⠀⠈⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⡀
⠀⠄⠀⠐⠀⠈⠀⠀⠠⠈⠀⠀⠀⡀⠈⠀⠈⠀⡀⠁⢠⡿⡯⣺⣪⣷⣽⣮⣷⣷⣾⣾⣾⣵⣧⣳⣕⢿⣮⣴⣶⣶⣵⣶⣬⣤⣡⣤⣢⣅⣤⣡⡈⡀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⢀⠠⠀
⠀⠄⠂⠁⠀⠂⠀⠂⠀⡀⠄⠂⠁⠀⠀⠁⠀⠁⠀⠀⠌⠟⠟⠛⣙⣭⣯⡿⡟⣟⢽⢝⢽⢕⣝⣮⣾⣵⣽⣺⣼⡸⣜⢮⡺⡽⡻⡽⣝⣝⢯⡻⣻⢻⢿⣶⣌⡀⡈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠀⠀
⠁⠀⠀⡀⠄⠐⠀⠐⠀⠀⠀⠀⢀⠀⠂⠈⠀⠐⠈⠀⠀⢄⣢⣿⡻⣝⢮⢮⡫⡮⣫⣳⡻⡫⣏⢗⢗⡵⣝⢮⡳⣻⡺⣕⣏⢯⢝⣞⣜⢮⡳⣝⢮⡳⡣⡳⡹⣿⣦⡠⠈⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠐⠀
⠐⠀⠁⠀⠀⢀⠀⠂⠀⠈⠀⠈⠀⠀⢀⠐⠀⠐⢀⢠⣵⢿⢝⢮⡺⣪⢪⢸⢸⠸⡹⣪⢮⢫⢪⢪⢣⢏⢮⡳⡝⡮⣺⡪⣺⢪⡳⣕⢮⢳⢝⢎⢗⡝⡜⡜⡜⣔⡻⣷⡄⠂⢀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠈⠀⠠
⢀⠠⠀⠐⠀⠀⡀⠄⠈⢀⣈⣀⣄⣈⣀⣠⣤⣵⢾⡻⡵⡝⡮⡳⡝⡮⣪⣗⢯⡫⡺⡪⡪⢪⠪⡊⡎⡭⡣⣓⢝⣞⣜⢞⢼⢕⣝⢎⡗⣝⡮⣳⡱⡩⣪⢪⡪⡲⡵⡝⣿⣆⢀⠀⠄⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠀⠁⠠⠀
⠀⠀⢀⠀⠂⠁⠀⠀⠀⣺⣿⡻⡫⣟⣝⢯⡺⣪⣳⢽⡪⣏⢮⡫⡮⣳⡗⣗⢵⢝⢮⣪⢺⢜⡎⣎⢎⢎⢎⢮⣳⡑⡌⡝⣗⢧⡳⣳⡻⡩⡫⡮⡺⣜⢜⢵⡹⣚⢮⢳⢕⢿⢷⣤⣀⠄⠂⠁⠀⠁⢀⠁⠀⠁⠀⠁⠀⠁⢀⠠
⠀⠐⠀⠀⡀⠄⠀⠂⠁⠐⢻⣾⣝⢮⡪⡧⣫⡾⡕⣗⢽⡸⡕⡧⣯⡳⡝⡮⣪⡳⣣⡳⣝⢵⡹⣪⢳⡹⡕⡧⣳⢘⢔⡌⡆⡳⡽⡣⡱⡨⢌⢯⡺⡪⣝⢵⡹⣪⢳⡹⣕⢝⢭⡻⡻⡿⣶⣶⢶⣵⣦⠄⠀⠁⠀⠁⠀⠁⠀⠀
⠀⠂⠀⠄⠀⠀⡀⠄⠀⠄⠂⠉⠙⢛⢻⣿⡳⡣⡯⡺⡪⣮⣳⢟⡕⣗⢝⢮⡺⣜⢮⡺⡜⡮⡺⣪⢳⢕⣝⢮⡗⢃⠃⠃⡉⠊⠎⢊⠘⡚⠬⢜⡗⡽⡸⣕⢝⡮⡳⡕⡧⡫⣇⢗⣝⢮⢺⡸⣕⢧⣿⢃⠈⠀⠁⠀⠁⠀⠂⠁
⠄⠐⠀⢀⠐⠀⠀⠀⢀⠀⢀⠠⠐⢠⣿⣳⢹⣪⣳⢽⢝⣞⢼⡱⣝⢼⡱⡳⡕⡧⡳⡵⣹⡪⡫⡮⡳⣣⢳⢕⡇⢐⠀⠡⠐⢈⠀⡂⠄⠐⡀⠂⡽⣪⢫⢎⢗⣝⢎⡗⣝⢮⡪⡳⡵⣭⣷⣽⡾⠟⠍⠀⠀⠀⠂⠁⠀⠁⢀⠀
⠀⠠⠀⢀⠀⠀⠂⠁⠀⠀⠀⠀⢀⢺⣟⣝⢝⢮⢺⡪⡳⡕⡧⡳⡕⡧⡫⡮⡳⣝⡺⣪⡺⣜⢝⡽⡺⣜⢕⢗⡇⠄⠨⠐⢈⠠⠐⠀⠄⠡⠀⠂⢝⢮⡪⡳⣕⡗⡧⡫⡮⡺⣜⢵⢝⢞⣯⡄⠐⠀⠠⠐⠈⠀⠠⠀⠂⠈⠀⠀
⠈⠀⢀⠀⢀⠐⠀⠠⠀⠁⠈⠀⡀⣿⡻⣺⢽⣪⣇⣯⣪⣳⣹⣜⢮⢳⡹⣪⡣⡳⣝⢼⢜⢮⢪⣻⡕⡵⡹⣕⢽⢀⠡⠈⠠⠠⢘⡀⠅⠂⢁⠁⢺⡱⣕⢝⡲⣏⢮⢳⢕⢽⡸⡪⣎⢗⢝⣿⠄⠠⠀⠀⡀⠠⠀⠀⠄⠠⠐⠀
⠀⠁⠀⠀⡀⠀⠠⠀⠀⠂⠀⠁⣼⣟⢮⡪⣳⢹⡹⣍⢯⡏⡮⡪⣎⢧⢳⡱⡝⡼⣇⢗⢵⡹⣪⡺⢝⡎⣗⢕⢽⢄⠐⢈⠀⡂⡑⡆⢂⠈⠄⠈⣼⢪⡪⣣⡻⠸⣕⢇⢯⡪⡮⣳⢱⢝⢎⢿⡇⠄⠀⠂⠀⠀⠠⠐⠀⠀⢀⠠
⠀⠀⠁⢀⠀⠠⠀⠐⠈⠀⢨⣼⡟⡮⣪⢺⢜⢵⡱⡕⣟⢎⢧⢫⢎⢮⡣⡳⡹⣺⢪⢳⡱⡣⣇⠏⡈⢷⡱⡝⣕⢧⠐⡀⠂⠄⠐⠑⡀⠌⡀⠅⣞⡕⣝⢼⠊⢀⢳⢝⢼⡸⡪⣳⡹⣜⠵⡽⡯⠀⠀⠄⠂⠁⠀⠀⠠⠐⠀⠀
⠀⠁⠈⠀⠀⠠⠀⢀⢂⣾⣟⢗⡝⣜⢎⢧⡫⢮⡚⣮⡗⡝⡎⡧⡫⣎⢮⢫⣺⡳⡹⡜⡎⣇⡿⠵⠴⠬⠳⣝⢜⢎⣇⠄⡈⠄⢁⠁⠄⡐⠔⢊⣗⢕⡧⠓⠈⡂⠈⢯⡪⡎⡧⣳⡣⡳⡹⢼⡏⠀⠄⠀⡀⠀⠄⠁⠀⢀⠀⠐
⠄⠂⠀⠂⠈⢀⣦⢷⡻⣣⢳⢕⢽⡸⣕⣗⢭⡣⡳⣹⡇⡯⡺⡸⡕⡵⡱⣳⢏⢮⢺⢸⢕⡗⠁⠄⠠⠐⠈⡈⠓⠧⣣⢧⠀⢂⠐⡀⠁⠄⠐⠰⡳⠩⢀⠂⡁⠄⠡⠐⢳⡹⡜⡎⣾⢱⢹⢽⡃⠐⠀⢀⠀⠀⠄⠀⠈⠀⠀⠀
⢀⠀⠄⠐⠀⠐⢿⣧⣗⣵⣳⣽⣾⣾⣗⢕⡇⡗⣝⣺⡕⣇⢯⢺⢸⡪⣽⢳⢹⡸⡪⣣⠗⠠⠡⠨⠠⠡⢂⠄⠅⡐⢀⠂⠌⠠⠐⢀⠡⠈⠄⠅⠔⠨⡀⡂⡐⠨⠠⠡⠨⣪⡺⡪⡪⣗⢕⣿⠐⠀⠐⠀⠀⠐⠀⠀⠁⢀⠈⠀
⠀⠀⡀⠀⠄⠂⠀⠉⠋⠋⠋⠡⢡⣿⡪⣣⢳⢹⢢⢻⡪⡎⡮⣪⢣⡷⡳⡱⡣⡇⣯⢾⢼⢮⢾⢮⢮⢶⢤⣂⢅⢀⠂⢐⠈⠠⢈⠠⠐⢈⠠⢨⢴⢵⠶⡶⣞⢾⢮⢦⣕⠰⣝⢎⢗⢝⣧⣿⠐⠈⠀⢀⠈⠀⠀⠁⡀⠄⠀⠐
⠀⠂⠀⢀⠀⠠⠀⠁⢀⠐⠈⣠⣿⢳⢹⡸⡜⣕⢇⡏⣞⢜⢎⣮⢻⡸⡪⡺⣸⡾⠽⠵⠝⡮⡳⠱⡝⡮⡳⡱⡽⠦⢈⠠⠀⠅⠠⠐⢀⠂⠄⠹⡕⢝⣝⢮⢚⢮⠳⠳⢽⡊⡮⣻⣜⢕⢎⢿⢶⣄⠠⠀⢀⠀⠁⢀⠀⠀⠠⠐
⠀⡀⠄⠀⠀⠄⠀⠂⢀⣠⣾⢞⢇⡏⡮⣪⢺⡸⡪⣪⣞⢵⢫⡪⡪⣪⢮⡞⣇⠣⢀⠠⠀⡗⠜⡌⢎⢯⡓⡅⡇⠐⠠⠐⢈⢀⠡⠈⠠⠐⢈⠀⣇⠣⢳⢛⠔⢜⡂⠀⡑⡁⡟⢦⡹⡻⢮⢧⣯⣻⠗⠀⢀⠀⠈⠀⠀⠠⠀⢀
⠀⠀⠀⠀⠁⠀⠄⣶⢿⢝⢮⢪⡣⡳⣹⡸⡼⣜⡮⣗⡧⡯⡮⡾⡝⡽⡱⡕⡽⡌⢀⠀⡀⠸⢵⣘⡔⡅⡆⡵⠃⡁⢂⠡⠀⠄⢐⠈⠠⠈⠄⡐⢘⢮⡢⣅⡣⡳⠁⠀⠄⢂⢇⢂⢯⣎⠪⡪⣻⡄⠀⠈⠀⠀⠐⠀⠈⠀⢀⠀
⠀⠁⠀⠁⠀⠂⠀⠻⣷⣽⢮⢧⢯⣞⣞⣮⣟⡮⡯⡗⠀⢝⡎⡮⡪⡎⣞⢜⢎⢽⢔⠀⡂⡐⠠⢈⠌⠨⢀⠂⡂⠂⡂⠄⠡⠈⠄⡈⠄⢃⠐⡀⢂⠐⡈⡐⡀⠂⠄⢂⠡⠈⢦⢡⣻⢻⣕⠌⣾⡃⠀⠈⠀⠐⠀⢀⠁⢀⠀⠠
⠀⠈⠀⠈⠀⡀⠂⠁⠈⠛⠻⠿⠟⠟⢟⣿⣺⣺⣽⣽⡀⠂⢫⡎⡞⡜⣎⢷⣹⢸⢪⢳⢄⡂⠅⠂⠄⠅⢂⢐⠠⢁⠐⡈⠄⡁⢂⠐⠐⡀⢂⠐⡀⡂⡐⡀⢂⠡⢁⠂⠌⠨⢘⣮⢏⠰⣗⣵⠏⡀⢀⠈⠀⠐⠈⠀⠀⠀⢀⠠
⠀⠈⠀⠈⠀⠀⢀⠀⠄⠐⠀⢀⠠⠀⠐⠻⡾⠟⠓⠙⢿⣦⡠⡙⣎⡇⡧⡣⡫⡓⡗⡗⠍⠅⠌⠨⠠⢁⢂⠐⡐⠠⢁⠐⡀⢂⢐⠨⡐⡔⢀⠂⡐⠠⠐⡀⢂⠂⡂⠌⠨⢐⡽⠍⠀⠀⠉⠁⠁⠀⠀⠀⠐⠀⠀⠄⠐⠈⠀⠀
⠐⠈⠀⠈⠀⠈⠀⠀⠀⠠⠐⠀⠀⠀⠄⠂⠀⠀⠂⢀⠐⠨⣿⣫⢟⡷⣵⡹⡜⡎⡎⢵⡱⣝⢝⢟⢞⢦⡄⠂⠄⠡⠐⡀⠂⠄⠂⡁⢐⠀⢂⠐⠠⢈⠐⣰⢼⢯⣟⣮⢜⢿⢵⣄⣂⣁⠈⠀⠐⠀⠈⠀⠐⠈⠀⠀⡀⠀⠄⠀
⠂⠀⠐⠀⠁⠀⠐⠀⠁⠀⢀⠀⠐⠀⢀⠀⠄⠂⠀⠄⢀⢼⣟⡮⣗⣯⣷⢷⢧⡳⡹⣘⠧⢧⣳⣹⣪⣣⢫⣆⠡⠈⠄⠐⡈⢀⠡⠀⢂⠈⠠⠀⢅⣐⡼⡽⣽⢽⣺⣽⣬⣢⣣⣭⠿⠃⠐⠀⠂⠀⠁⠀⠂⠀⡀⠁⠀⢀⠠⠀
⢀⠈⠀⠀⠂⠁⠀⠐⠀⠈⠀⠀⠀⠂⠀⠀⢀⠀⠄⠀⠨⢻⢾⣽⢾⣿⢯⣳⣽⠷⣝⢜⡝⣵⣲⢴⣢⢊⡧⡪⡿⡝⡺⢶⣶⣖⡶⠼⠴⣾⡾⡽⡯⣗⡯⢫⢮⢮⣬⡟⠈⠉⠉⠀⠐⠀⠂⠀⠐⠀⠁⠀⠂⠀⡀⠠⠐⠀⠀⠀
⠀⠀⠈⠀⠠⠀⠈⠀⠐⠀⠂⠁⠀⠂⠈⠀⠀⡀⠀⠐⠀⠠⠀⣄⣤⢾⢻⢫⡞⡡⢊⢧⢳⠽⡬⡭⡥⢥⢳⣹⣿⢴⢟⢲⣕⢟⡮⣛⢞⢿⡯⣟⠽⣗⡿⣺⡼⣽⣏⠀⡀⠂⠀⠁⢀⠐⠀⠈⠀⠀⠂⠀⠂⠀⡀⠀⠀⡀⠄⠈
⡀⠂⠁⠀⠄⠐⠈⠀⠀⠂⠀⠠⠐⠀⠠⠈⠀⠀⠀⠂⡀⣦⢟⠝⢌⢢⢣⢳⢁⣊⢶⡇⢵⣱⡱⡣⡯⢳⣹⠯⡋⠼⡽⢩⣪⡳⡱⡽⣮⢾⢽⢽⣗⡦⣝⠳⢿⢽⢻⣆⠀⠀⠄⠁⠀⠀⠀⠂⠁⠀⠂⠀⠂⠀⡀⠀⠁⠀⠀⠀
⠀⠀⠠⠀⠠⠀⢀⠐⠀⠐⠀⡀⢀⠠⠀⠀⠐⠈⠀⠠⣾⠫⠢⡑⢬⣷⣵⢇⠲⡱⣹⢽⣬⡪⡮⣞⡾⡝⠊⠐⠨⡪⡪⢺⣪⡮⡷⡫⣏⢗⣝⡜⣞⡿⡷⣯⡶⣥⣳⢿⣄⠂⠀⠠⠐⠈⠀⠀⠄⠂⠀⠂⠀⠂⠀⠀⠂⠀⠂⠁
⡀⠂⠀⠄⠀⠄⠀⢀⠀⠂⠀⠀⠀⠀⠀⠈⠀⡀⠀⣽⡏⢜⠌⢜⣺⠂⣽⡂⡂⠪⡪⡛⡞⢟⢻⢩⠏⠠⠈⡀⠱⣐⡸⠘⣽⣻⢼⢵⠵⠗⠣⣧⣷⢯⣟⣗⡿⣽⣺⣻⡷⠀⠂⠀⢀⠀⠄⠂⠀⠀⠄⠐⠀⠐⠀⠁⠀⠐⠀⠀
⠀⠀⠠⠀⠠⠀⠐⠀⠀⡀⠈⠀⠁⠀⠁⠀⠁⠀⠀⠺⠷⣧⣎⡆⣿⠄⠊⣷⣄⢂⠄⡡⣑⣡⡷⡛⠛⠷⠷⡶⣶⢦⡶⣼⣿⣦⢦⢶⠶⠗⡛⠁⡘⢿⣾⣾⣽⣺⣾⡟⠁⠂⠀⠈⠀⠀⠀⢀⠀⠂⠀⠠⠀⠂⠀⠄⠁⠀⠂⠁
⠠⠈⠀⢀⠠⠀⠠⠐⠀⠀⠀⠂⠈⠀⠈⠀⠐⠈⠀⠀⠂⠀⠉⠙⠻⠁⢀⠀⠋⠛⠛⠛⠙⠁⠀⡀⠀⠄⠀⠄⠀⢀⠀⢀⠈⠀⠀⠠⠐⠀⠀⢀⠀⠀⠈⠉⠛⠋⠃⠄⠂⠀⠁⠀⠂⠀⠁⠀⢀⠀⠂⠀⠠⠀⠄⠀⡀⠂⠀⠠
⠀⠀⡀⠀⠀⢀⠀⢀⠀⠈⠀⠐⠀⠈⠀⠈⠀⡀⠄⠁⠀⠐⠀⠂⠀⠄⠀⢀⠀⠂⠀⠁⠀⠄⠁⠀⢀⠠⠀⠠⠀⢀⠀⢀⠀⠀⠁⠀⡀⠀⠈⠀⠀⠈⠀⠠⠀⠄⠀⠄⠀⠐⠈⠀⠐⠈⠀⠈⠀⠀⢀⠈⠀⠀⡀⠀⡀⠀⠐⠀
⠂⠁⠀⠀⠁⠀⢀⠀⢀⠈⠀⠐⠀⠈⠀⡀⠁⠀⠀⠀⠈⠀⠠⠐⠀⢀⠐⠀⠀⠠⠈⠀⠐⠀⠀⠄⠀⠀⢀⠠⠀⢀⠀⢀⠀⠈⢀⠠⠀⠀⠁⡀⠈⠀⠐⠀⢀⠠⠀⠠⠐⠀⠠⠐⠀⠀⠄⠂⠀⠈⠀⠀⠀⠁⠀⠀⡀⠀⠂⠀
⠀⠀⠄⠂⠁⠀⡀⠀⡀⠀⠐⠀⡀⠁⠀⡀⠀⠄⠂⠁⠀⠁⠀⡀⠀⡀⠀⡀⠈⠀⠀⠐⠀⠐⠀⠠⠀⠁⠀⠀⠀⡀⠀⡀⠀⠈⠀⠀⠀⡀⠁⠀⢀⠈⠀⠠⠀⠀⠀⡀⠀⡀⢀⠀⠠⠀⢀⠠⠀⠁⠀⠈⠀⠐⠀⠁⠀⠀⠐⠈
*/