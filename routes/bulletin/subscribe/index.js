var express = require('express');
var router = express.Router();
var pool = require('../../../database');
var tokens = require('../../../tokens');
var { isEmail } = require('validator');


router.post('/subscribe' ,async (req, res) => {
    var token = await tokens.validateToken(pool,req.body.token);
    if (token) {
        const email = req.body.email;

        // Validar que el correo sea válido
        if (!isEmail(email)) {
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['El correo electrónico no es válido'],
                info: 'Error interno, intentalo de nuevo',
                token:req.body.token
            });
        }

        // Validar que el correo no esté ya registrado
        pool.query('SELECT * FROM bulletin WHERE correo = ?', [email], (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: 0,
                    data: [],
                    warnings: ['Error interno en la base de datos'],
                    info: 'Error interno, intentalo de nuevo',
                    token:req.body.token
                });
            }
            if (results.length > 0) {
                return res.status(409).json({
                    status: 0,
                    data: [],
                    warnings: [],
                    info: 'ya estas suscrito a nuestro boletín',
                    token:req.body.token
                });
            }

            // Insertar el nuevo usuario en la base de datos
            pool.query('INSERT INTO bulletin (correo) VALUES (?)', [email], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        status: 0,
                        data: [],
                        warnings: ['Error interno en la base de datos'],
                        info: 'Error interno, intentalo de nuevo',
                        token:req.body.token
                        
                    });
                }

                return res.status(201).json({
                    status: 1,
                    data: [],
                    warnings: [],
                    info: 'Gracias por suscribirte a nuestro boletín',
                    token:req.body.token
                });
            });
        });
    }
    else{
        return res.status(401).json({
            status: 0,
            data: [],
            warnings: ['No tienes permiso para realizar esta acción'],
            info: 'Error interno, intentalo de nuevo',
            token:req.body.token
        });
    }
});

module.exports = router;
