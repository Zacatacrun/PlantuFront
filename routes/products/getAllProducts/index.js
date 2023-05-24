const express = require("express");
const router = express.Router();
const pool = require("../../../database");

router.get("/getAllProducts", async (req, res) => {
  try {
    // Obtener todos los productos
    const query = `SELECT * FROM plantas;`;
    const rows = await pool.query(query);
    // Validar que no esté vacío
    if (!rows || !Object.keys(rows).length) {
      return res.status(204).json({
        status: 0,
        data: [],
        warnings: [],
        info: "No se encontraron productos",
      });
    }

    // Convertir resultados en una lista de objetos JSON
    const products = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: row.precio,
      stock: row.stock,
      imagen: row.imagen,
      categoria: {
        id: row.categoria_id,
        nombre: row.categoria_nombre,
      },
      vivero: {
        id: row.vivero_id,
        nombre: row.vivero_nombre,
      },
    }));

    // Validar que no se repita en otras categorías
    const uniqueProducts = [];
    const seen = new Set();
    products.forEach((product) => {
      if (!seen.has(product.nombre)) {
        uniqueProducts.push(product);
        seen.add(product.nombre);
      }
    });

    return res.status(200).json({
      status: 1,
      data: uniqueProducts,
      warnings: [],
      info: "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 0,
      data: [],
      warnings: [error],
      info: "Ocurrió un error al obtener los productos",
    });
  }
});

module.exports = router;
