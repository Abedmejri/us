require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/couple', require('./routes/couple'));
app.use('/api/drawing', require('./routes/drawing'));
app.use('/api/game', require('./routes/game'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));

// SQLite Connection & Sync
sequelize.sync({ alter: true })
    .then(async () => {
        console.log('SQLite/Sequelize synced');

        // Seed Admin Account
        const User = require('./models/User');
        const adminExists = await User.findOne({ where: { username: 'admin' } });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                password: 'admin',
                isAdmin: true,
                inviteCode: 'ADMIN'
            });
            console.log('Admin account created (admin/admin)');
        }
    })
    .catch(err => console.error('Sequelize sync error:', err));

// Socket.IO Logic
io.on('connection', (socket) => {
    socket.on('join_couple', (coupleId) => {
        socket.join(coupleId);
    });

    socket.on('send_drawing', (data) => {
        socket.to(data.coupleId).emit('receive_drawing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});