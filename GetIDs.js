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
//crea una funcion llamada get vivero data que recibe un pool y un token y retorna los datos del vivero
async function getViveroData(pool, token) {
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
        const vivero= await pool.query('SELECT * FROM viveros WHERE vendedor_id = ?',[user[0].id]);
        if(vivero.length===0){
            console.log('El vivero no existe en la base de datos');
            return false;
        }
        const viveroData={
            id: vivero[0].id,
            nombre: vivero[0].nombre,
            descripcion: vivero[0].descripcion,
            imagen: vivero[0].imagen,
            vendedor_id: vivero[0].vendedor_id,
            aceptado: vivero[0].aceptado
        }
        return viveroData ;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
// create a function that recibes a pool and un string llamado tipo, retorna los datos de la categoria la fucnion debe llamarse getCategoryData
async function getCategoryData(pool, tipo) {
    try {
        console.log(tipo+'hola');
        const categoria= await pool.query('SELECT * FROM categorias WHERE nombre = ?',[tipo]);
        if(categoria.length===0){
            console.log('La categoria no existe en la base de datos');
            return false;
        }
        const categoryData={
            id: categoria[0].id,
            tipo: categoria[0].tipo
        }
        return categoryData ;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = {
    getViveroId,
    getUserId,
    getUserData,
    getCategoryData,
    getViveroData
};