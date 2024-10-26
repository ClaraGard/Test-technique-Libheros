module.exports = (sequelize, DataTypes) => {
    const TaskList = sequelize.define('TaskList', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    }, {});
    
    TaskList.associate = function(models) {
      TaskList.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      TaskList.hasMany(models.Task, {
        foreignKey: 'taskListId',
        onDelete: 'CASCADE'
      });
    };
    
    return TaskList;
  };
  