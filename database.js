var mysql = require('mysql');
var {database} = require('./keys');

var {promisify} = require('util');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'plantu'
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
    }
    if (connection) connection.release();
    console.log('DB is connected');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;