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
    const sql = 'SELECT * FROM employees ORDER BY employee_id ASC';
    try {
        const resultado = await db.query(sql);
        return resultado.rows;
    } catch (err) {
        console.error('Error en capa de datos (obtenerUsuarios):', err.message);
        throw err;
    }
}

async function obtenerUsuario(id) {
    const sql = 'SELECT * FROM employees WHERE employee_id = $1';
    try {
        const resultado = await db.query(sql, [id]);
        return resultado.rows[0];
    } catch (err) {
        console.error(`Error en capa de datos (obtenerUsuario - ID: ${id}):`, err.message);
        throw err;
    }
}

async function delete_user(id) {
    const sql = 'DELETE FROM employees WHERE employee_id = $1';
    try {
        const resultado = await db.query(sql, [id]);
        
        if (resultado.rowCount > 0) {
            return { exito: true, mensaje: `Empleado con ID ${id} eliminado correctamente.` };
        } else {
            return { exito: false, mensaje: `No se encontró ningún empleado con el ID ${id}.` };
        }
    } catch (err) {
        console.error(`Error en la BD al intentar eliminar al usuario ${id}:`, err.message);
        throw err;
    }
}

async function insertar(emple_n) {
    const sql = 'INSERT INTO employees (employee_id, last_name, first_name, title) VALUES ($1, $2, $3, $4) RETURNING *';
    
    const params = [
        emple_n.employeeId || emple_n.employee_id,
        emple_n.lastName || emple_n.last_name,
        emple_n.firstName || emple_n.first_name,
        emple_n.title
    ];

    try {
        const resultado = await db.query(sql, params);
        if (resultado.rowCount > 0) {
            return {
                exito: true,
                mensaje: "Datos insertados correctamente",
                datos: resultado.rows[0]
            };
        }
        throw new Error("La inserción se ejecutó pero no devolvió ningún registro.");
    } catch (err) {
        console.error('Error en la BD al ejecutar inserción de empleado:', err.message);
        throw err;
    }
}

async function actualizacionParcial(id, params) {
    const columnas = Object.keys(params);
    
    if (columnas.length === 0) {
        return { exito: false, mensaje: "No se proporcionaron campos para actualizar." };
    }

    const valores = Object.values(params);

    const columnsql = columnas.map((llave, index) => { 
        const col_tab = traductorColumnas[llave] || llave;
        return `${col_tab} = $${index + 1}`;
    }).join(', ');
    
    const sql = `UPDATE employees SET ${columnsql} WHERE employee_id = $${columnas.length + 1} RETURNING *`;
    valores.push(id);
    
    try {
        const resultado = await db.query(sql, valores);
        
        if (resultado.rowCount > 0) {
            return { 
                exito: true, 
                mensaje: "Datos actualizados correctamente.",
                datos: resultado.rows[0] 
            };
        } else {
            return { exito: false, mensaje: "El empleado especificado no existe." };
        }  
    } catch (err) {
        console.error(`Error en la BD al actualizar parcialmente al empleado ${id}:`, err.message);
        throw err;
    }
}

module.exports = { 
    obtenerUsuarios, 
    obtenerUsuario, 
    insertar, 
    delete_user, 
    actualizacionParcial 
};