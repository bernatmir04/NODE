const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Crear una aplicación Express
const app = express();
const server = http.createServer(app); // Crear el servidor HTTP con Express
const io = socketIo(server); // Inicializar Socket.IO en el servidor

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba para asegurarte de que el servidor esté funcionando
app.get('/', (req, res) => {
    res.send('Servidor Express con Socket.IO funcionando');
});

// Escuchar nuevas conexiones de sockets
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Escuchar eventos del cliente (por ejemplo, una pregunta publicada)
    socket.on('newQuestion', (data) => {
        console.log('Pregunta recibida:', data);
        // Emitir a todos los clientes (usuarios y mentores)
        io.emit('questionPublished', data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
