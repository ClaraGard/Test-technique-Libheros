module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('TaskLists', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('TaskLists', ['userId']);
  }
};