const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Game = require('../models/Game');

router.post('/', auth, async (req, res) => {
    try {
        const { word } = req.body;
        const game = await Game.create({
            coupleId: req.user.coupleId,
            creatorId: req.user.id,
            word: word.toLowerCase(),
        });
        res.status(201).send(game);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.get('/active', auth, async (req, res) => {
    try {
        const game = await Game.findOne({ coupleId: req.user.coupleId, status: 'active' });
        res.send(game);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/:id/guess', auth, async (req, res) => {
    try {
        const { guess } = req.body;
        const game = await Game.findOne({ id: req.params.id });

        if (!game || game.status !== 'active') return res.status(404).send({ message: 'No active game' });

        const target = game.word;
        const result = [];
        const guessArr = guess.toLowerCase().split('');
        const targetArr = target.split('');

        for (let i = 0; i < guessArr.length; i++) {
            if (guessArr[i] === targetArr[i]) {
                result[i] = 2; // Green
                targetArr[i] = null;
            } else {
                result[i] = 0;
            }
        }
        for (let i = 0; i < guessArr.length; i++) {
            if (result[i] === 0) {
                const idx = targetArr.indexOf(guessArr[i]);
                if (idx !== -1) {
                    result[i] = 1; // Yellow
                    targetArr[idx] = null;
                }
            }
        }

        const newGuesses = [...game.guesses, { guess, result }];

        let status = 'active';
        let winnerId = null;
        if (guess.toLowerCase() === target) {
            status = 'completed';
            winnerId = req.user.id;
        } else if (newGuesses.length >= 6) {
            status = 'completed';
        }

        game.guesses = newGuesses;
        game.status = status;
        game.winnerId = winnerId;
        await game.save();

        res.send(game);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).send({ message: 'Game not found' });

        if (game.creatorId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        await Game.deleteOne({ id: req.params.id });
        res.send({ message: 'Deleted' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;
