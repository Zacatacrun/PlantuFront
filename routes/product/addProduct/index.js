const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { isEmail } = require('validator');

router.post('/addProduct', async (req, res) => {
    const { usuario, nombre, descripcion,categoria, precio, stock } = req.body;
    //imprimir en consola los datos que se reciben
    console.log(req.body);
    
    if (!usuario || !nombre || !descripcion|| !categoria  || !precio || !stock) {
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Todos los campos son obligatorios',
      });
    }
  
    try {
      // Verificar si el usuario existe y es un vivero

    const [userRows] = await pool.query('SELECT id FROM usuarios WHERE correo = ? AND rol = "vivero"', [usuario]);
    
    if (!userRows || !Object.keys(userRows).length) {
    return res.status(403).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Solo los viveros pueden agregar productos',
    });
    }
    const usuarioid = Object.keys(userRows).find(key => key === "id");
    const usuarioID = userRows[usuarioid];
    const [vivero] = await pool.query('SELECT id FROM viveros WHERE vendedor_id = ?', [usuarioID]);
    console.log(vivero);
    console.log("vivero id: " + usuarioID);
    if (!vivero) {
    return res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error al obtener el vivero',
    });
    }
    
    const viveroid = Object.keys(vivero).find(key => key === "id");
    const viveroId = vivero[viveroid];
    
      // Verificar que el producto no exista con el mismo nombre y vivero id
      const [productRows] = await pool.query('SELECT * FROM plantas WHERE nombre = ? AND vivero_id = ?', [nombre, viveroId]);
        //imprimir en consola los datos que se reciben
      if (productRows && Object.keys(productRows).length) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [],
          info: 'Ya existe un producto con ese nombre para este vivero',
        });
      }
      // Verificar que la categoría exista
      const [categoriaRows] = await pool.query('SELECT * FROM categorias WHERE nombre = ?', [categoria]);
      //validar que la categoria exista
        if (!categoriaRows || !Object.keys(categoriaRows).length) {
        return res.status(404).json({
            status: 0,
            data: [],
            warnings: [],
            info: 'La categoría no existe',
        });
        }
      // Obtener el id de la categoría
      
      const categoriaid = Object.keys(categoriaRows).find(key => key === "id");
      const categoriaID = categoriaRows[categoriaid];

      // Insertar el nuevo producto
      const insertResult = await pool.query('INSERT INTO plantas (nombre, descripcion, precio, stock, vendedor_id, categoria_id, vivero_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, descripcion, precio, stock, usuarioID, categoriaID, viveroId]);
      // Obtener el producto insertado
      const newProductRows = await pool.query('SELECT * FROM plantas WHERE id = ?', [insertResult.insertId]);
      //imprimir en consola los datos que se reciben
      

      if (!newProductRows || !Object.keys(newProductRows).length) {
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: [],
          info: 'Error al obtener el producto insertado',
        });
      }
  
      const newProductData = newProductRows[0];
  
      return res.status(201).json({
        status: 1,
        data: {
          new: newProductData,
        },
        warnings: [],
        info: 'Producto agregado exitosamente',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 0,
        data: [],
        warnings: [],
        info: 'Error al agregar el producto',
      });
    }
  });
module.exports = router;
