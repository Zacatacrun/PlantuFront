const express = require("express");
const router = express.Router();
const pool = require("../../../database");


router.get("/getAllProductsByCategory", async (req, res) => {
    try {
      let products = await pool.query(`
        SELECT
          plantas.id AS id,
          plantas.nombre AS nombre,
          plantas.descripcion AS descripcion,
          plantas.precio AS precio,
          plantas.stock AS stock,
          plantas.imagen AS imagen,
          categorias.id AS categoria_id,
          categorias.nombre AS categoria_nombre,
          viveros.id AS vivero_id,
          viveros.nombre AS vivero_nombre
        FROM
          plantas
          JOIN categorias ON plantas.categoria_id = categorias.id
          JOIN viveros ON plantas.vivero_id = viveros.id
        ORDER BY
          categorias.nombre ASC
      `);
  
      if (products.length == 0) {
        return res.status(400).json({
          status: 0,
          data: [],
          warnings: [],
          info: "No se encontraron productos",
          token: req.body.token
        });
      }
  
      let productsByCategory = {};
      products.forEach((row) => {
        if (!productsByCategory[row.categoria_nombre]) {
          productsByCategory[row.categoria_nombre] = [];
        }
  
        productsByCategory[row.categoria_nombre].push({
          id: row.id,
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: row.precio,
          stock: row.stock,
          imagen: row.imagen,
          vivero: {
            id: row.vivero_id,
            nombre: row.vivero_nombre,
          },
        });
      });
  
      return res.status(200).json({
        status: 1,
        data: productsByCategory,
        warnings: [],
        info: "Productos encontrados",
        token: req.body.token
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: 0,
        data: [],
        warnings: [],
        info: "Error interno, intentalo de nuevo",
        token: req.body.token
      });
    }
  });

module.exports = router;
