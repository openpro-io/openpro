'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('issues', 'description_raw', {
      type: Sequelize.BLOB,
      defaultValue: null,
    });
    await queryInterface.changeColumn('issue_comments', 'comment_raw', {
      type: Sequelize.BLOB,
      defaultValue: null,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('issues', 'description_raw', {
      type: Sequelize.BLOB,
      defaultValue: undefined,
    });
    await queryInterface.changeColumn('issue_comments', 'comment_raw', {
      type: Sequelize.BLOB,
      defaultValue: undefined,
    });
  },
};
