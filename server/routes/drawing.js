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
        const drawings = await Drawing.find({ coupleId: req.user.coupleId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.send(drawings);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const drawing = await Drawing.findOne({ id: req.params.id });
        if (!drawing) return res.status(404).send({ message: 'Drawing not found' });

        if (drawing.senderId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        await Drawing.deleteOne({ id: req.params.id });
        res.send({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
