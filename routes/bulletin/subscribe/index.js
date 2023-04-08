const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { isEmail } = require('validator');

router.get('/subscribe', function(req, res, next) {
    const email = req.query.email;

    // Validar que el correo sea válido
    if (!isEmail(email)) {
        return res.json({
            status: 0,
            data: [],
            warnings: ['El correo electrónico no es válido'],
            info: 'Error interno, intentalo de nuevo'
        });
    }

    // Validar que el correo no esté ya registrado
    pool.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.json({
                status: 0,
                data: [],
                warnings: ['Error interno en la base de datos'],
                info: 'Error interno, intentalo de nuevo'
            });
        }

        if (results.length > 0) {
            return res.json({
                status: 0,
                data: [],
                warnings: ['El correo electrónico ya está registrado'],
                info: 'Gracias por suscribirte a nuestro boletín'
            });
        }

        // Insertar el nuevo usuario en la base de datos
        pool.query('INSERT INTO usuarios (email) VALUES (?)', [email], (err, results) => {
            if (err) {
                return res.json({
                    status: 0,
                    data: [],
                    warnings: ['Error interno en la base de datos'],
                    info: 'Error interno, intentalo de nuevo'
                });
            }

            return res.json({
                status: 1,
                data: [],
                warnings: [],
                info: 'Gracias por suscribirte a nuestro boletín'
            });
        });
    });
});

module.exports = router;