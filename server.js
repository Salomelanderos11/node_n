// server.js
// Importamos el módulo HTTP nativo de Node.js
const http = require('http');

// Definimos el puerto donde escuchará el servidor
const PORT = 3000;

// Creamos el servidor
const server = http.createServer((req, res) => {
    // Configuramos la cabecera de la respuesta HTTP
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // Creamos un objeto para responder
    const respuesta = {
        mensaje: "Bienvenido a tu primer servidor en Node.js",
        rutaSolicitada: req.url
    };

    // Enviamos la respuesta en formato JSON
    res.end(JSON.stringify(respuesta));
});

// Iniciamos el servidor
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});