const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const { saveToken, validateToken, deleteToken } = require('../../../tokens');

// Agregar un nuevo usuario
router.post('/usuarios', async (req, res) => {
  const { nombre, correo, rol, contraseña } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (existingUser) {
      return res.status(400).json({
        status: 0,
        data: [],
        info: 'El correo proporcionado ya está registrado',
      });
    }

    // Insertar el nuevo usuario en la base de datos
    const insertResult = await pool.query(
      'INSERT INTO usuarios (nombre, correo, rol, contraseña) VALUES (?, ?, ?, ?)',
      [nombre, correo, rol, contraseña]
    );

    // Obtener el usuario insertado
    const [newUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [insertResult.insertId]);

    return res.status(201).json({
      status: 1,
      data: {
        new: newUser,
      },
      info: 'Usuario agregado exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al agregar el usuario',
    });
  }
});

// Eliminar un usuario por su ID
router.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

    if (!existingUser) {
      return res.status(404).json({
        status: 0,
        data: [],
        info: 'El usuario no existe',
      });
    }

    // Eliminar el usuario de la base de datos
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

    return res.status(200).json({
      status: 1,
      data: [],
      info: 'Usuario eliminado exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al eliminar el usuario',
    });
  }
});

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const [users] = await pool.query('SELECT * FROM usuarios');

    return res.status(200).json({
      status: 1,
      data: users,
      info: 'Usuarios obtenidos exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al obtener los usuarios',
    });
  }
});

// Editar un usuario por su ID
router.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;

  try {
    // Verificar si el usuario existe
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

    if (!existingUser) {
      return res.status(404).json({
        status: 0,
        data: [],
        info: 'El usuario no existe',
      });
    }

    // Actualizar los datos del usuario en la base de datos
    await pool.query('UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?', [nombre, correo, rol, id]);

    // Obtener el usuario actualizado
    const [updatedUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

    return res.status(200).json({
      status: 1,
      data: {
        updated: updatedUser,
      },
      info: 'Usuario actualizado exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al actualizar el usuario',
    });
  }
});

// Guardar un token en la base de datos
router.post('/tokens', async (req, res) => {
  const { user, token } = req.body;

  try {
    const saveResult = await saveToken(pool, user, token);

    if (!saveResult) {
      return res.status(500).json({
        status: 0,
        data: [],
        info: 'Error al guardar el token',
      });
    }

    return res.status(200).json({
      status: 1,
      data: [],
      info: 'Token guardado exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al guardar el token',
    });
  }
});

// Validar un token en la base de datos
router.post('/tokens/validate', async (req, res) => {
  const { token } = req.body;

  try {
    const isValid = await validateToken(pool, token);

    return res.status(200).json({
      status: 1,
      data: {
        valid: isValid,
      },
      info: 'Token validado exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al validar el token',
    });
  }
});

// Eliminar un token de la base de datos
router.delete('/tokens/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const deleteResult = await deleteToken(pool, token);

    if (!deleteResult) {
      return res.status(500).json({
        status: 0,
        data: [],
        info: 'Error al eliminar el token',
      });
    }

    return res.status(200).json({
      status: 1,
      data: [],
      info: 'Token eliminado exitosamente',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 0,
      data: [],
      info: 'Error al eliminar el token',
    });
  }
});

module.exports = router;
