/*
gettvivero	
[in] 
id: vivero_id
[out] 
status: 0 | 1
data: [out]
warnings: Array<string>
info: "informacion de vivero optenida" | "No se ha podido encontrar el vivero"	Validaciones:
1. Validar que el vivero exiista. 
*/
const express = require('express');
const router = express.Router();
const pool = require('../../../database');

router.get('/getVivero', async (req, res) => {
    const{viveroID} = req.body;
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
    else{
        return res.status(200).json({
            status: 1,
            data: vivero[0],
            warnings: [],
            info: 'informacion de vivero optenida',
            token: req.body.token
            });
    }
});

module.exports = router;