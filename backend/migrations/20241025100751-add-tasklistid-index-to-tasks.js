module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Tasks', ['taskListId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Tasks', ['taskListId']);
  }
};
