const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { body, validationResult } = require('express-validator');

// Endpoint para recuperar el historial de compras del usuario
router.get('/getTransaction', [
    body('Idusuario')
      .notEmpty().withMessage('El campo userId es obligatorio')
      .isInt().withMessage('Debe ser un número entero')
      .toInt(),
    body('*').trim().escape(),
  ], async (req, res) => {
      // Verificar si existen errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 0,
      data: [],
      warnings: errors.array().map(e => e.msg),
      info: 'Error interno, inténtalo de nuevo'
    });
  }
    const {IdUser} = req.body;
    try {
        // Verificar si el usuario está en la tabla de usuarios
        const user = await pool.query('SELECT * FROM usuarios WHERE id = ?', [IdUser]);
        if (user.length === 0) {
          return res.status(401).json({
            status: 0,
            data: [],
            warnings: ['Usuario no autenticado'],
            info: 'Error interno, inténtalo de nuevo'
          });
        }
    
        // Obtener el historial de compras del usuario
        const purchaseHistory = await pool.query(
          `SELECT c.id, p.nombre AS nombre_producto, c.fecha_compra, c.precio, c.cantidad, c.estado
            FROM compras c
            INNER JOIN plantas p ON c.planta_id = p.id
            WHERE c.usuario_id = ?
            ORDER BY c.fecha_compra DESC`,
          [IdUser]
        );
    
        return res.status(200).json({
          status: 1,
          data: purchaseHistory,
          warnings: [],
          info: 'Historial de compras del usuario'
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          status: 0,
          data: [],
          warnings: ['Error interno en la base de datos'],
          info: 'Error interno, inténtalo de nuevo'
        });
    }
});

module.exports = router;

/*
Implementar una API REST para obtener las estadísticas de los productos de cada vivero registrado.
La API REST debe ser implementada y estar disponible en una URL específica.
La API debe devolver datos precisos y actualizados sobre las estadísticas de los productos de cada vivero registrado.
La API debe estar asegurada mediante el uso de autenticación y autorización, permitiendo solo a los usuarios autorizados acceder a la información de las estadísticas.
La API debe ser fácilmente integrable con otras aplicaciones o sistemas externos que puedan necesitar acceder a las estadísticas de los viveros.
La API debe ser eficiente y escalable, capaz de manejar un alto volumen de solicitudes sin problemas de rendimiento.
Se debe documentar adecuadamente la API, incluyendo información sobre cómo acceder a ella, los parámetros y valores que acepta, el formato de los datos devueltos, y cualquier otra información relevante.

Asegurarse de que solo los viveros registrados tengan acceso a sus propias estadísticas y no a la de otros viveros. Implementar autenticación y autorización adecuadas.
La plataforma debe permitir que solo los viveros registrados accedan a sus propias estadísticas y no a las de otros viveros.
La autenticación y autorización adecuadas deben implementarse para garantizar que solo los viveros registrados puedan acceder a sus propias estadísticas.
La información de estadísticas de los viveros debe ser precisa y actualizada en tiempo real.
La vista de estadísticas debe mostrar información detallada sobre el rendimiento de los productos de cada vivero registrado, incluyendo información sobre la cantidad de productos vendidos, ingresos generados y las opiniones de los usuarios sobre los productos.
La plataforma debe permitir a los viveros filtrar las estadísticas por fecha, producto y otros criterios relevantes para su negocio.
La vista de estadísticas debe tener una interfaz de usuario intuitiva y fácil de usar para que los viveros puedan navegar y entender la información presentada.

*/