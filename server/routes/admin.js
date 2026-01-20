const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Couple = require('../models/Couple');
const Drawing = require('../models/Drawing');
const Game = require('../models/Game');

// Middleware to ensure user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send({ message: 'Admin access required' });
    }
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Delete user and everything related
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        if (user.username === 'admin') return res.status(400).send({ message: 'Cannot delete super admin' });

        const coupleId = user.coupleId;

        await User.deleteOne({ id: req.params.id });

        if (coupleId) {
            await Couple.deleteOne({ id: coupleId });
            await Drawing.deleteMany({ coupleId });
            await Game.deleteMany({ coupleId });
            await User.updateMany({ coupleId: coupleId }, { coupleId: null });
        }

        res.send({ message: 'User and related data wiped' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Get all couples
router.get('/couples', auth, isAdmin, async (req, res) => {
    try {
        const couples = await Couple.find({});
        res.send(couples);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Reset entire database (Nuclear option for admin)
router.post('/reset', auth, isAdmin, async (req, res) => {
    try {
        await Drawing.deleteMany({});
        await Game.deleteMany({});
        await Couple.deleteMany({});
        await User.deleteMany({ username: { $ne: 'admin' } });

        res.send({ message: 'Database reset (except admin)' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
