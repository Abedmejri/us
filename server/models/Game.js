const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    coupleId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    word: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guesses: {
        type: DataTypes.JSON, // Use JSON for the array of guesses
        defaultValue: [],
    },
    status: {
        type: DataTypes.ENUM('active', 'completed'),
        defaultValue: 'active',
    },
    winnerId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
});

module.exports = Game;
