const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Couple = require('../models/Couple');

router.get('/me', auth, async (req, res) => {
    try {
        if (!req.user.coupleId) {
            return res.send({ coupled: false, inviteCode: req.user.inviteCode });
        }
        const couple = await Couple.findByPk(req.user.coupleId);
        // In a real app we'd join with users, but for now we manually fetch
        const user1 = await User.findByPk(couple.user1Id);
        const user2 = await User.findByPk(couple.user2Id);

        res.send({
            coupled: true,
            couple: { ...couple.toJSON(), user1, user2 }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/join', auth, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const partner = await User.findOne({ where: { inviteCode } });

        if (!partner) return res.status(404).send({ message: 'Invalid code' });
        if (partner.id === req.user.id) return res.status(400).send({ message: 'No self-love here' });
        if (partner.coupleId) return res.status(400).send({ message: 'Already coupled' });

        const couple = await Couple.create({
            user1Id: partner.id,
            user2Id: req.user.id,
            status: 'active'
        });

        await User.update({ coupleId: couple.id }, { where: { id: [req.user.id, partner.id] } });

        res.send({ couple });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

const Drawing = require('../models/Drawing');
const Game = require('../models/Game');

router.get('/timeline', auth, async (req, res) => {
    try {
        const coupleId = req.user.coupleId;
        if (!coupleId) return res.status(400).send({ message: 'Not coupled' });

        const [drawings, games] = await Promise.all([
            Drawing.findAll({ where: { coupleId }, order: [['createdAt', 'DESC']], limit: 20 }),
            Game.findAll({ where: { coupleId }, order: [['createdAt', 'DESC']], limit: 20 })
        ]);

        // Combine and sort
        const timeline = [
            ...drawings.map(d => ({ ...d.toJSON(), type: 'drawing' })),
            ...games.map(g => ({ ...g.toJSON(), type: 'game' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.send(timeline);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
