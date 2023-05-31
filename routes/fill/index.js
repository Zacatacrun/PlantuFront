const express = require("express");
const router = express.Router();
const pool = require("../../database");

router.get(
  "/9a033a567c2f1efe0645cdd8671ba91f34dcb410f250132e1e02d00675e21497",
  async (req, res) => {
    try {
      for (let i = 0; i < 100; i++) {
        const newUser = {
          nombre: `user${i}`,
          correo: `mail${i}@fake.com`,
          contraseña: `$2b$10$HQwjOmAoW8ZBwabMxDxLeOXuMdxAc/yQ01DZbF2iv1ByzAiO2YrZm`, // 123456Aa
          rol: i % 2 === 0 ? "admin" : i % 3 === 0 ? "user" : "vivero",
        };
        await pool.query("INSERT INTO usuarios SET ?", [newUser]);
      }

      // add categories
      for (let i = 0; i < 100; i++) {
        const newCategory = {
          nombre: `description${i}`,
        };
        await pool.query("INSERT INTO categorias SET ?", [newCategory]);
      }

      //add viveros
      for (let i = 0; i < 100; i++) {
        //get id from usuarios with rol viveros
        const viveroId = await pool.query(
          'SELECT id FROM usuarios WHERE rol = "vivero"'
        );

        const newVivero = {
          nombre: `vivero${i}`,
          correo: `vivero${i}@fake.com`,
          descripcion: `description${i}`,
          imagen: `https://picsum.photos/200/300?random`,
          vendedor_id: viveroId[Math.floor(Math.random() * viveroId.length)].id,
          aceptado: 1,
        };

        await pool.query("INSERT INTO viveros SET ?", [newVivero]);
      }

      // add plantas
      for (let i = 0; i < 100; i++) {
        const randomImages = [
          "https%3A%2F%2Fwww.fisenf.com%2Fwp-content%2Fuploads%2F2015%2F11%2Ffrutas-y-frutos-secos.jpg",
          "https://s2.ppllstatics.com/diariovasco/www/multimedia/202106/04/media/cortadas/platano-kUyC-RCIEbjdcaFn9Yc7KKpofzYN-624x385@Diario%20Vasco-DiarioVasco.jpg",
          "https://fruteriaonlinemadrid.es/wp-content/uploads/2021/10/platano-macho-verde-150x171.jpg",
        ];
      }

      //get usuarios with rol vivero
      const vendedoresIds = await pool.query(
        'SELECT id FROM usuarios WHERE rol = "vivero"'
      );

      //get viveros ids from table viveros
      const viverosIds = await pool.query("SELECT id FROM viveros");

      //add plantas
      for (let i = 0; i < 100; i++) {
        const newPlanta = {
          nombre: `plant${i}`,
          descripcion: `description${i}`,
          precio: i,
          stock: i,
          imagen: randomImages[Math.floor(Math.random() * randomImages.length)], // random image from array
          categoria_id: Math.random() * 100,
          vendedor_id:
            vendedoresIds[Math.floor(Math.random() * vendedoresIds.length)].id,
          vivero_id:
            viverosIds[Math.floor(Math.random() * viverosIds.length)].id,
        };
        await pool.query("INSERT INTO plantas SET ?", [newPlanta]);
      }

      res.status(200).json({ message: "Database seeded" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
