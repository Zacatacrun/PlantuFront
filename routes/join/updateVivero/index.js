/*

jupdateVivero	[in] 
viveroID: number
viveroName: string
viveroEmail: string
descripcion: string
imagen: string
token: string

[out] 
status: 0 | 1
data: []
warnings: Array<string>
info: "Actualizacion exitosa" | "Error actualizando datos"	Validaciones:
1. Validar que el correo sea válido
2. Validar que el usuario pertenezca al vivero
4. validar que los campos no esten vacios  
*/
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../../database');
const tokens = require('../../../tokens');
const getIds = require('../../../GetIDs');
const image = require('../../../Image');

const { isEmail } = require('validator');


router.put('/updateVivero', async (req, res) => {
    const viveroID = req.body.viveroID;
    const imagen = req.body.image;
    const viveroName = req.body.viveroName;
    const viveroEmail = req.body.viveroEmail;
    const descripcion = req.body.descripcion;
    const token = req.body.token;
    const user = await getIds.getUserData(pool,token);
    if(user.length==0){
        return res.status(400).json({
            status: 0,
            data: [],
            warnings: ['No se encontro el usuario'],
            info: 'Error interno, intentalo de nuevo',
            token: req.body.token
            });
    }

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

    if(tokens.validateToken(pool,token)&&user.id==vivero[0].vendedor_id){
        let query = 'UPDATE viveros SET ';
        let params = [];
        if(viveroName){
            query += 'nombre=?,';
            params.push(viveroName);
        }
        if(viveroEmail){
            query += 'correo=?,';
            params.push(viveroEmail);
        }
        if(descripcion){
            query += 'descripcion=?,';
            params.push(descripcion);
        }
        if(imagen){
            query += 'imagen=?,';
            params.push(imagen);
        }
        query = query.slice(0,-1);
        query += ' WHERE id=?';
        params.push(viveroID);
        let solicitud= await pool.query(query,params);
        if(solicitud.affectedRows>0){
            const nuevo= await pool.query('SELECT * FROM viveros WHERE id=?',[viveroID]);
            return res.status(200).json({
                status: 1,
                data: [{
                    antiguo: vivero[0],
                    nuevo: nuevo[0]
                }],
                warnings: [],
                info: 'Actualizacion exitosa',
                token: req.body.token
                });
        }else{
            return res.status(400).json({
                status: 0,
                data: [],
                warnings: ['Error actualizando datos'],
                info: 'Error interno, intentalo de nuevo',
                token: req.body.token
                });
        }

    }
    return res.status(400).json({
        status: 0,
        data: [],
        warnings: ['No tienes permiso para realizar esta accion'],
        info: 'Error interno, intentalo de nuevo',
        token: req.body.token
    });
});

module.exports = router;
