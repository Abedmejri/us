const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gameSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    coupleId: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    word: {
        type: String,
        required: true
    },
    guesses: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    winnerId: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
