module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: DataTypes.STRING,
    }, {});
    
    User.associate = function(models) {
      User.hasMany(models.TaskList, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    };
    
    return User;
  };
  