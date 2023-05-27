const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../../database');
const tokens = require('../../../tokens');
const getIds = require('../../../GetIDs');
const { isEmail } = require('validator');

router.post('/checkVivero', async (req, res) => {
    const vivero_id = req.body.vivero_id;
    const token = req.body.token;
    if (!vivero_id || !token ) {
        return res.status(400).json({
        status: 0,  
        data: [],
        warnings: ['Faltan campos obligatorios'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
        });
    }
    if(await tokens.validateAdminToken(pool,token)){
        //valida que no falten campos obligatorios
        const vivero = await pool.query('SELECT * FROM viveros WHERE id=?',[vivero_id]);
        if(vivero.length==0){
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['No existe el vivero'],
                info: 'Error interno, intentalo de nuevo',
                token: req.body.token
                });
        }
        const user = await pool.query('SELECT * FROM usuarios WHERE id=?',[vivero[0].vendedor_id]);
        
        if(user.length==0){
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['No existe el vendedor'],
                info: 'Error interno, intentalo de nuevo',
                token: req.body.token
                });
        }
        //valida que el usuario exista y sea un usuario
        const viveroPorValidar = await pool.query('SELECT * FROM viverosporvalidar WHERE id_vivero=?',[vivero_id]);
        if(viveroPorValidar.length==0){
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['No se encontro el vivero'],
                info: 'Error interno, no se encontró la solicitud de vivero o ya fue validada',
                token: req.body.token
                });
        }
        try{
            let solicitud=await pool.query('DELETE FROM viverosporvalidar WHERE id_vivero=?',[vivero_id]);
            if(solicitud.affectedRows == 0){
                return res.status(400).json({
                    status: 0,
                    data: [],
                    warnings: [''],
                    info: 'fallo al eliminar la solicitud de vivero',
                    token: req.body.token
                    });
            }
            solicitud = await pool.query('UPDATE viveros SET aceptado = 1 WHERE id = ?',[vivero_id]);
            if(solicitud.affectedRows == 0){
                return res.status(400).json({
                    status: 0,
                    data: [],
                    warnings: [''],
                    info: 'fallo al actualizar el vivero',
                    token: req.body.token
                    });
            }
            console.log('UPDATE usuarios SET rol = "vivero" WHERE id = ?',[user[0].id]);
            solicitud = await pool.query('UPDATE usuarios SET rol = "vivero" WHERE id = ?',[user[0].id]);
            if(solicitud.affectedRows == 0){
                return res.status(400).json({
                    status: 0,
                    data: [],
                    warnings: [''],
                    info: 'fallo al actualizar el rol del usuario',
                    token: req.body.token
                    });
            }
            return res.status(200).json({
                status: 1,
                data: [],
                warnings: ['Vivero validado'],
                info: 'Vivero validado',
                token: req.body.token
                });
        }catch (error) {
            console.log(error);
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['Error interno'],
                info: 'Error interno, intentalo de nuevo',
                token: req.body.token
                });
        }
    }
    else{
    return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['Token invalido'],
        info: 'acceso denegado, no cuentas con los permisos necesarios',
        token: req.body.token
    });
    }
  
});

module.exports = router;
