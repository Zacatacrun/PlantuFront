const express = require('express');
const router = express.Router();
const pool = require('../../../database');

router.post('/viverosEstadisticas', function(req, res, next) {
  const { idVivero, idDueno, tipo } = req.body;
  
  // Verificar si el vivero existe y pertenece al dueño especificado
  var verificarViveroQuery = 'SELECT * FROM viveros WHERE id = ? AND vendedor_id = ? AND aceptado = true';
  pool.query(verificarViveroQuery, [idVivero, idDueno], function(error, results) {
    if (error) {
      res.status(500).json({
        status: 0,
        data: [],
        info: 'Error al consultar la base de datos',
        warnings: [error.message],
      });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({
        status: 0,
        data: [],
        info: 'El vivero especificado no existe, no pertenece al dueño indicado o no ha sido aceptado',
        warnings: [],
      });
      return;
    }

    // Realizar las consultas según el tipo de estadísticas requeridas
    switch (tipo) {
      case 'productos_mas_vendidos':
        var productosMasVendidosQuery = `
          SELECT p.nombre AS nombre_producto, SUM(dt.cantidad) AS total_vendido
          FROM plantas p
          INNER JOIN detalles_transaccion dt ON dt.planta_id = p.id
          WHERE p.vivero_id = ?
          GROUP BY p.id
          ORDER BY total_vendido DESC`;
        pool.query(productosMasVendidosQuery, [idVivero], function(error, results) {
          if (error) {
            res.status(500).json({
              status: 0,
              data: [],
              info: 'Error al consultar la base de datos',
              warnings: [error.message],
            });
            return;
          }
          res.status(200).json({
            status: 1,
            data: results,
            info: 'Productos más vendidos del vivero',
            warnings: [],
          });
        });
        break;

      case 'ingresos_generados':
        var ingresosGeneradosQuery = `
          SELECT SUM(p.precio * dt.cantidad) AS total_ingresos
          FROM plantas p
          INNER JOIN detalles_transaccion dt ON dt.planta_id = p.id
          WHERE p.vivero_id = ?`;
        pool.query(ingresosGeneradosQuery, [idVivero], function(error, results) {
          if (error) {
            res.status(500).json({
              status: 0,
              data: [],
              info: 'Error al consultar la base de datos',
              warnings: [error.message],
            });
            return;
          }
          res.status(200).json({
            status: 1,
            data: results[0],
            info: 'Ingresos generados por el vivero',
            warnings: [],
          });
        });
        break;

      case 'opiniones_usuarios':
        var opinionesUsuariosQuery = `
          SELECT v.comentario, v.valoracion, p.nombre AS nombre_producto
          FROM valoraciones v
          INNER JOIN plantas p ON p.id = v.planta_id
          WHERE p.vivero_id = ?`;
        pool.query(opinionesUsuariosQuery, [idVivero], function(error, results) {
          if (error) {
            res.status(500).json({
              status: 0,
              data: [],
              info: 'Error al consultar la base de datos',
              warnings: [error.message],
            });
            return;
          }
          res.status(200).json({
            status: 1,
            data: results,
            info: 'Opiniones de los usuarios sobre los productos del vivero',
            warnings: [],
          });
        });
        break;

      default:
        res.status(400).json({
          status: 0,
          data: [],
          info: 'Tipo de consulta no válido',
          warnings: [],
        });
        break;
    }
  });
});

module.exports = router;