// src/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'magda',
    password: 'magda',
    database: 'ummrene',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
