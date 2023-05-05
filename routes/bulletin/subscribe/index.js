const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { isEmail } = require('validator');

router.post('/subscribe', function(req, res, next) {
    const email = req.body.email;

    // Validar que el correo sea válido
    if (!isEmail(email)) {
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['El correo electrónico no es válido'],
            info: 'Error interno, intentalo de nuevo'
        });
    }

    // Validar que el correo no esté ya registrado
    pool.query('SELECT * FROM bulletin WHERE correo = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 0,
                data: [],
                warnings: ['Error interno en la base de datos'],
                info: 'Error interno, intentalo de nuevo'
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                status: 0,
                data: [],
                warnings: [],
                info: 'Gracias por suscribirte a nuestro boletín'
            });
        }

        // Insertar el nuevo usuario en la base de datos
        pool.query('INSERT INTO bulletin (correo) VALUES (?)', [email], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: 0,
                    data: [],
                    warnings: ['Error interno en la base de datos'],
                    info: 'Error interno, intentalo de nuevo'
                });
            }

            return res.status(201).json({
                status: 1,
                data: [],
                warnings: [],
                info: 'Gracias por suscribirte a nuestro boletín'
            });
        });
    });
});

module.exports = router;
