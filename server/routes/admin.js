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
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Delete user and everything related
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        if (user.username === 'admin') return res.status(400).send({ message: 'Cannot delete super admin' });

        const coupleId = user.coupleId;

        // If they are in a couple, clean up the couple data too?
        // Let's just delete the user first. 
        // If we want "everything", we might want to delete the whole couple.

        await user.destroy();

        // If the user was part of a couple, we might want to orphan the partner or delete the couple.
        // For "delete everything", let's be thorough.
        if (coupleId) {
            await Couple.destroy({ where: { id: coupleId } });
            await Drawing.destroy({ where: { coupleId } });
            await Game.destroy({ where: { coupleId } });
            // Update the partner to have no coupleId
            await User.update({ coupleId: null }, { where: { coupleId: coupleId } });
        }

        res.send({ message: 'User and related data wiped' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Get all couples
router.get('/couples', auth, isAdmin, async (req, res) => {
    try {
        const couples = await Couple.findAll();
        res.send(couples);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Reset entire database (Nuclear option for admin)
router.post('/reset', auth, isAdmin, async (req, res) => {
    try {
        await Drawing.destroy({ where: {}, truncate: true });
        await Game.destroy({ where: {}, truncate: true });
        await Couple.destroy({ where: {}, truncate: true });
        // Delete all users EXCEPT admin
        const { Op } = require('sequelize');
        await User.destroy({ where: { username: { [Op.ne]: 'admin' } } });

        res.send({ message: 'Database reset (except admin)' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
