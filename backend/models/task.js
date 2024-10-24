module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      shortDescription: DataTypes.STRING,
      longDescription: DataTypes.TEXT,
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      dueDate: DataTypes.DATE
    }, {});
    
    Task.associate = function(models) {
      Task.belongsTo(models.TaskList, {
        foreignKey: 'taskListId',
        onDelete: 'CASCADE'
      });
    };
    
    return Task;
  };
  