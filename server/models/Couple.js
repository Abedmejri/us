const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const coupleSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    user1Id: {
        type: String,
        required: true
    },
    user2Id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Couple', coupleSchema);
