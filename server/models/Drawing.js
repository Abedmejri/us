const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const drawingSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    coupleId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    imageData: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Drawing', drawingSchema);
