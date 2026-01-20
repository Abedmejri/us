const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Drawing = require('../models/Drawing');

router.post('/', auth, async (req, res) => {
    try {
        const { imageData } = req.body;
        const drawing = await Drawing.create({
            coupleId: req.user.coupleId,
            senderId: req.user.id,
            imageData
        });
        res.status(201).send(drawing);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const drawings = await Drawing.findAll({
            where: { coupleId: req.user.coupleId },
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        res.send(drawings);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const drawing = await Drawing.findByPk(req.params.id);
        if (!drawing) return res.status(404).send({ message: 'Drawing not found' });

        // Only sender, couple partner (if we want), or admin can delete
        if (drawing.senderId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        await drawing.destroy();
        res.send({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
