
//metodo que recibe un usuario y un token y lo guarda en la base de datos, retorna true si se guardo o false si no se guardo 
async function saveToken(pool,user, token) {
    try {
      // Buscamos al usuario en la base de datos
      const rows = await pool.query('SELECT id FROM usuarios WHERE nombre = ?', [user]);
      //convert the rows to an json object
      const userObj = JSON.parse(JSON.stringify(rows));
      // Validamos que el usuario exista

      if (rows.length === 0) {
        //throw new Error('El usuario no existe en la base de datos');
        //imprime el error en la consola
        console.log('El usuario no existe en la base de datos');
        return false;
      }
      //get the id of the user from the json object
      const userId = userObj[0].id;
      const result = await pool.query('INSERT INTO tokens (token, usuario_id) VALUES (?, ?)', [token, userId]);
      const tokenObj = JSON.parse(JSON.stringify(result));
      // Retornamos verdadero si se insertó el token
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
//metodo que recibe un token y valida si existe en la base de datos y si es valido, retorna true si es valido o false si no lo es
async function validateToken(pool,token) {
    console.log('validateToken');   
    try {
        // Buscamos el token en la base de datos
        const rows = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        //convert the rows to an json object
        const tokenObj = JSON.parse(JSON.stringify(rows));
        console.log(rows.length === 0);
        
        // Validamos que el token exista
        if (rows.length === 0) {
            //throw new Error('El token no existe en la base de datos');
            //imprime el error en la consola
            console.log('El token no existe en la base de datos');
            return false;
        }
        
        //get the id of the token from the json object
        const tokenId = tokenObj[0].id;
        
        //get the date of the token from the json object
        const tokenDate = tokenObj[0].fecha_creacion;
        console.log(tokenDate);
        
        //get the date of today
        const today = new Date();
        
        //get the date of the token
        const tokenDateObj = new Date(tokenDate);
        
        //compare the dates
        if (tokenDateObj > today) {
            console.log('La fecha de creación del token es mayor a la fecha actual');
            return false;
        }
        
        //get the difference between the date of today and the date of the token
        const diffTime = Math.abs(today - tokenDateObj);
        console.log(diffTime);
        
        //get the difference in days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays);
        //if the difference in days is greater than 1 delete the token from the database
        if (diffDays > 1) {
            //delete the token from the database
            await pool.query('DELETE FROM tokens WHERE id = ?', [tokenId]);
            return false;
        }
        

        //if the difference in days is less than 1 return true
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
//crea una funcion que reciba un token y lo valide, si es valido borralo de la basse de datos y retorna true, si no es valido retorna false
async function deleteToken(pool,token) {
    try {
        // Buscamos el token en la base de datos
        const rows = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        //convert the rows to an json object
        const tokenObj = JSON.parse(JSON.stringify(rows));
        // Validamos que el token exista
        if (rows.length === 0) {
            //throw new Error('El token no existe en la base de datos');
            //imprime el error en la consola
            console.log('El token no existe en la base de datos');
            return false;
        }
        //get the id of the token from the json object
        const tokenId = tokenObj[0].id;
        //delete the token from the database
        await pool.query('DELETE FROM tokens WHERE id = ?', [tokenId]);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
  module.exports = {
    saveToken,
    validateToken,
    deleteToken
  };