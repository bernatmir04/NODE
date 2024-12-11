const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Configura con el dominio de tu frontend
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

let questions = []; // Lista de preguntas publicadas

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Evento para publicar una nueva pregunta
    socket.on('publish_question', (questionData) => {
        const question = {
            id: Date.now(),
            text: questionData.text,
            user: questionData.user, // Datos del usuario que la formula
            timestamp: new Date()
        };

        questions.push(question);

        // Emitir la nueva pregunta a todos los usuarios y mentores
        io.emit('new_question', question);
        console.log(`Nueva pregunta publicada: ${question.text}`);
    });

    // Evento para enviar preguntas actuales al conectarse
    socket.on('get_questions', () => {
        socket.emit('questions_list', questions);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

// Ruta para validar logins (solo ejemplo)
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    // Aquí va la lógica para validar el usuario en la base de datos
    if (username === 'admin' && password === 'admin123' && role === 'admin') {
        res.status(200).json({ token: 'mock-token', role: 'admin' });
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
