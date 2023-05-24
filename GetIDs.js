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
module.exports = {
    getViveroId,
    getUserId
};