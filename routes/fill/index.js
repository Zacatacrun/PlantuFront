const express = require("express");
const router = express.Router();
const pool = require("../../database");

router.get(
  "/9a033a567c2f1efe0645cdd8671ba91f34dcb410f250132e1e02d00675e21497",
  async (req, res) => {
    try {
      // add users
      for (let i = 0; i < 20; i++) {
        const roles = ["admin", "user", "vivero"];
        const newUser = {
          nombre: `user${i}`,
          correo: `mail${i}@fake.com`,
          contraseña: `$2b$10$HQwjOmAoW8ZBwabMxDxLeOXuMdxAc/yQ01DZbF2iv1ByzAiO2YrZm`, // 123456Aa
          rol: roles[Math.floor(Math.random() * roles.length)],
        };
        await pool.query("INSERT INTO usuarios SET ?", [newUser]);
      }

      // add categories
      for (let i = 0; i < 20; i++) {
        const newCategory = {
          nombre: `description${i}`,
        };
        await pool.query("INSERT INTO categorias SET ?", [newCategory]);
      }

      //add viveros
      //get id from usuarios with rol viveros
      const viveroId = await pool.query(
        'SELECT id FROM usuarios WHERE rol = "vivero"'
      );

      viveroId.forEach(async (vivero) => {
        const newVivero = {
          nombre: `vivero${vivero.id}`,
          correo: `vivero${vivero.id}@fake.com`,
          descripcion: `description${vivero.id}`,
          imagen: `https://picsum.photos/200/300?random`,
          vendedor_id: vivero.id,
          aceptado: 1,
        };

        await pool.query("INSERT INTO viveros SET ?", [newVivero]);
      });

      //get usuarios with rol vivero
      const vendedoresIds = await pool.query(
        'SELECT id FROM usuarios WHERE rol = "vivero"'
      );

      //get viveros ids from table viveros
      const viverosIds = await pool.query("SELECT id FROM viveros");
      const categoriasIds = await pool.query("SELECT id FROM categorias");

      const randomImages = [
        "https://biotrendies.com/wp-content/uploads/2015/06/frutos-secos.jpg",
        "https://fisenf.com/wp-content/uploads/2015/11/frutas-y-frutos-secos.jpg",
        "https://biotrendies.com/wp-content/uploads/2015/06/manzana.jpg",
      ];
      //add plantas
      for (let i = 0; i < 100; i++) {
        const newPlanta = {
          nombre: `plant${i}`,
          descripcion: `description${i}`,
          precio: i,
          stock: i,
          imagen: randomImages[Math.floor(Math.random() * randomImages.length)],
          categoria_id:
            categoriasIds[Math.floor(Math.random() * categoriasIds.length)].id,
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
