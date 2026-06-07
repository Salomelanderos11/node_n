const db = require('./db');

const traductorColumnas = {
    employeeId: 'employee_id',
    lastName: 'last_name',
    firstName: 'first_name',
    title: 'title',
    titleOfCourtesy: 'title_of_courtesy',
    birthDate: 'birth_date',
    hireDate: 'hire_date',
    address: 'address',
    city: 'city',
    region: 'region',
    postalCode: 'postal_code',
    country: 'country',
    homePhone: 'home_phone',
    extension: 'extension',
    photo: 'photo',
    notes: 'notes',
    reportsTo: 'reports_to',
    photoPath: 'photo_path'
  };

async function obtenerUsuarios() {
  const sql = 'SELECT * FROM employees';
  try {
    const resultado = await db.query(sql);
    return resultado.rows;
  } catch (err) {
    console.error('No se pudieron obtener los usuarios:', err.message);
    throw err;
  }
}

async function obtenerUsuario(id) {
  const sql = 'SELECT * FROM employees WHERE employee_id = $1';
  try {
    const resultado = await db.query(sql, [id]);
    return resultado.rows[0]; // 👈 Corregido para que devuelva un objeto o undefined
  } catch (err) {
    console.error('No se pudo obtener el usuario:', err.message);
    throw err;
  }
}

async function delete_user(id) {
  const sql = 'DELETE FROM employees WHERE employee_id = $1';
  try {
    const resultado = await db.query(sql, [id]);
    if (resultado.rowCount > 0) {
      console.log(`Empleado con ID ${id} eliminado correctamente.`);
      return { exito: true, mensaje: "Empleado eliminado" };
    } else {
      console.log(`No se encontró ningún empleado con el ID ${id}.`);
      return { exito: false, mensaje: "El empleado no existe" };
    }
  } catch (err) {
    console.error('Error interno al eliminar el usuario:', err.message);
    return { exito: false, error: err.message };
  }
}

async function insertar(emple_n) {
  
  const sql = 'INSERT INTO employees (employee_id, last_name, first_name, title) VALUES ($1, $2, $3, $4) RETURNING *';
  
// Mapeo explícito y seguro de los parámetros
  
const params = Object.values(emple_n);

  try {
    const resultado = await db.query(sql, params);
    if (resultado.rowCount > 0) {
        console.log('Inserción correcta en PostgreSQL');
        return {
            exito: true,
            datos: resultado.rows[0]
        };
    }    
  } catch (err) {
    console.error('La consulta falló de forma interna:', err.message);
    return { exito: false, error: err.message };
  }
}



async function actualizacionParcial(id,params) {
  
  const columnas = Object.keys(params);
  const valores = Object.values(params);
  

  const columnsql = columnas.map((llave,index)=>  { 
    const col_tab = traductorColumnas[llave] || llave;
    return `${col_tab} = $${index+1}`
  }).join(', ');
  
  
  const sql = `update employees set ${columnsql} where employee_id = $${columnas.length + 1} RETURNING *`;
  valores.push(id);
  
  try {
    const resultado = await db.query(sql, valores);
    if (resultado.rowCount > 0) {
      return { exito: true, datos: resultado.rows[0] };
    } else {
      return { exito: false, mensaje: "El empleado no existe" };
    }  
  } catch (err) {
    console.error('La consulta falló de forma interna:', err.message);
    return { exito: false, error: err.message };
  }
}

module.exports = { obtenerUsuarios, obtenerUsuario, insertar, delete_user,actualizacionParcial };