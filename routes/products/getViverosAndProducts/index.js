const express = require("express");
const router = express.Router();
const pool = require("../../../database");

router.get("/getViverosAndProducts", async (req, res) => {
  //consultar todos los viveros a la base de datos y pasar el resultado a json
  var query = "SELECT * FROM viveros";
  var viverosResponse = await pool.query(query);
  var viverosRE = JSON.parse(JSON.stringify(viverosResponse));
  // Realizar la consulta a la base de datos
  pool.query(
    "SELECT * FROM viveros JOIN plantas ON viveros.id = plantas.vivero_id",
    (err, viverosResponse) => {
      if (err) {
        return res.status(500).json({
          status: 1,
          data: [],
          warnings: [],
          info: "Error en la base de datos",
        });
      }

      if (!viverosResponse.length) {
        return res.status(404).json({
          status: 1,
          data: [],
          warnings: [],
          info: "No se encontraron resultados",
        });
      }
      //convertir la respuesta de la base de datos a json
      const viverosR = JSON.parse(JSON.stringify(viverosResponse));
      // Convertir los resultados a la estructura solicitada
      let currentVivero = null;
      //imprimir viverosResponse

      const viveros = [];

for (const vivero of viverosRE) {
  const currentVivero = {
    nombre: vivero.nombre,
    imagen: vivero.imagen,
    productos: [],
  };

  for (const planta of viverosR) {
    if (planta.vivero_id === vivero.id) {
      currentVivero.productos.push({
        id: planta.id,
        nombre: planta.nombre,
        descripcion: planta.descripcion,
        vendedor_id: planta.vendedor_id,
        precio: planta.precio,
        stock: planta.stock,
        imagen: planta.imagen,
        categoria_id: planta.categoria_id,
        vivero_id: planta.vivero_id,
      });
    }
  }

  viveros.push(currentVivero);
}

      return res.status(200).json({
        status: 0,
        data: { viveros },
        warnings: [],
        info: "",
      });
    }
  );
});

module.exports = router;
