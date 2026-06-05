const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'NORTWIND',
  password: '1',
  port: 5432, // Puerto por defecto de PostgreSQL
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