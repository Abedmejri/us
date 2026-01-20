const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Couple = sequelize.define('Couple', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user1Id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user2Id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'active'),
        defaultValue: 'pending',
    },
    anniversary: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Couple;
