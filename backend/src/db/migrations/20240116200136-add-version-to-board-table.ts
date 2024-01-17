const TABLE_NAME = 'boards';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, 'version', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(TABLE_NAME, 'version');
  },
};
