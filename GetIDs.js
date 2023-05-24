const { json } = require("express");

async function getViveroId(pool, token) {
    try {
        // Buscamos el token en la base de datos
        const rows = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        if (rows.length === 0) {
            console.log('El token no existe en la base de datos');
            return false;
        }
        const tokenId = rows[0].id;
        const user_id = rows[0].usuario_id;
        const vivero_id= await pool.query('SELECT * FROM viveros WHERE vendedor_id = ?', [user_id]);
        if (vivero_id.length === 0) {
            console.log('El usuario no es un vivero ');
            return false;
        }
        return vivero_id[0].id;
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function getUserId(pool, token) {
    try {
        // Buscamos el token en la base de datos
        const rows = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        if (rows.length === 0) {
            console.log('El token no existe en la base de datos');
            return false;
        }
        const user_id = rows[0].usuario_id;
        return user_id;
    } catch (error) {
        console.log(error);
        return false;
    }
}
//create a function that recibe a token and return the user data
async function getUserData(pool, token) {
    try {
        // Buscamos el token en la base de datos
        const rows = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        if(rows.length===0){
            console.log('El token no existe en la base de datos');
            return false;
        }
        const user= await pool.query('SELECT * FROM usuarios WHERE id = ?',[rows[0].usuario_id]);
        if(user.length===0){
            console.log('El usuario no existe en la base de datos');
            return false;
        }
        const userData={
            id: user[0].id,
            nombre: user[0].nombre,
            correo: user[0].correo,
            rol: user[0].rol
        }
        return userData ;
    }
    catch (error) {
        console.log(error);
        return false;
    }  
}
module.exports = {
    getViveroId,
    getUserId,
    getUserData
};