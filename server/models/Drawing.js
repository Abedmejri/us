const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Drawing = sequelize.define('Drawing', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    coupleId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    imageData: {
        type: DataTypes.TEXT, // Using TEXT for Base64 (longer than STRING default)
        allowNull: false,
    },
    reaction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Drawing;
