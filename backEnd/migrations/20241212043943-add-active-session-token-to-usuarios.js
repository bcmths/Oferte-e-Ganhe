module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("usuario", "active_session_token", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("usuario", "active_session_token");
  },
};
