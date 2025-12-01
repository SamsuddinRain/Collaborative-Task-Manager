// backend/src/models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: { type: DataTypes.STRING, allowNull: false },

  role: {
    type: DataTypes.ENUM('user', 'manager'),
    defaultValue: 'user',
  },
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
