require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');

// Database connection middleware for Serverless
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log('MongoDB Connected');

        // Seed Admin if it doesn't exist
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            await User.create({
                username: 'admin',
                password: 'admin',
                isAdmin: true,
                inviteCode: 'ADMIN'
            });
            console.log('Admin account seeded');
        }
    } catch (err) {
        console.error('DB Connection/Seeding Error:', err.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Test Route
app.get('/api/test', (req, res) => {
    res.send({
        message: 'Backend is active',
        dbConnected: !!isConnected,
        envCheck: !!process.env.MONGODB_URI
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/couple', require('./routes/couple'));
app.use('/api/drawing', require('./routes/drawing'));
app.use('/api/game', require('./routes/game'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));

// Socket.IO Logic
io.on('connection', (socket) => {
    socket.on('join_couple', (coupleId) => {
        socket.join(coupleId);
    });
    socket.on('send_drawing', (data) => {
        socket.to(data.coupleId).emit('receive_drawing', data);
    });
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;