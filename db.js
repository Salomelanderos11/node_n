require('dotenv').config(); // 👈 Carga las variables del archivo .env
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Función para realizar consultas
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Consulta ejecutada en', duration, 'ms');
    return res;
  } catch (error) {
    console.error('Error en la consulta:', error.message);
    throw error;
  }
};

module.exports = { query };

