/*
updatevivero	
[in] 
id: vivero_id
[out] 
status: 0 | 1
data: [out]
warnings: Array<string>
info: "svivero eliminado" | "No se ha podido eliminar el vivero"	Validaciones:
1. Validar que el vivero exiista. 2.validar que el usuario sea  vivero
3. validar que el rol de uduario sea user al finalizar la solicitud
4. validar que los datos no esten vacios
*/
const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const tokens = require('../../../tokens');
const getIds = require('../../../GetIDs');
const { isEmail } = require('validator');

router.delete('/deleteVivero', async (req, res) => {
    const{viveroID,token} = req.body;
    const user = await getIds.getUserData(pool,token);
    const vivero = await pool.query('SELECT * FROM viveros WHERE id=?',[viveroID]);
    if(vivero.length==0){
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['No se encontro el vivero'],
            info: 'Error interno, intentalo de nuevo',
            token: req.body.token
            });
    }
    if(user.length==0){
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['No se encontro el usuario'],
            info: 'Error interno, intentalo de nuevo',
            token: req.body.token
            });
    }
    else if(user.rol!='vivero'||user.id!=vivero[0].vendedor_id||!tokens.validateToken(pool,token)){
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['No tienes permisos para realizar esta accion'],
            info: 'Error interno, intentalo de nuevo',
            token: req.body.token
            });
    }
    else{
        let solicitud = await pool.query('DELETE FROM viveros WHERE id=?',[viveroID]);
        if(solicitud.affectedRows==1){
            const solicitud= await pool.query('UPDATE usuarios SET rol=? WHERE id=?',['user',user.id]);
            if(solicitud.affectedRows==0){
                return res.status(400).json({
                    status: 0,
                    data: [],
                    warnings: ['No se pudo actualizar el rol'],
                    info: 'Error interno, intentalo de nuevo',
                    token: req.body.token
                    });
            }
            return res.status(200).json({
                status: 1,
                data: [vivero],
                warnings: ['Vivero eliminado'],
                info: 'Vivero eliminado',
                token: req.body.token
                });
        }
        else{
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['No se ha podido eliminar el vivero'],
                info: 'Error interno, intentalo de nuevo',
                token: req.body.token
                });
        }
    }


});

module.exports = router;