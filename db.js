require('dotenv').config(); // 👈 Carga las variables del archivo .env
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const obtenerUsuarios = async () => {
  const sql = 'SELECT * FROM employees';
  try {
    const resultado = await pool.query(sql);
    return resultado.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error.message);
    throw error;
  }
};

module.exports = { obtenerUsuarios };