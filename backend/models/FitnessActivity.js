const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure you have a Sequelize instance configured

const FitnessActivity = sequelize.define('FitnessActivity', {
    name: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
    caloriesBurned: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = FitnessActivity;
