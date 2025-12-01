// backend/src/models/index.js

const { sequelize } = require('../config/db');

const User = require('./User');
const Task = require('./Task');
const ActivityLog = require('./ActivityLog');

// Relations
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });

Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creatorUser' });

Task.hasMany(ActivityLog, { foreignKey: 'taskId', as: 'logs' });
ActivityLog.belongsTo(Task, { foreignKey: 'taskId' });

ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'actionUser' });
User.hasMany(ActivityLog, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Task,
  ActivityLog
};
