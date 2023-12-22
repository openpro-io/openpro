'use strict';

const TABLE_NAME = 'issues';
const COLUMN_NAME = 'vector_search';
const SEARCH_FIELDS = ['title', 'description'];
const INDEX_NAME = 'issues_vector_search';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;

    return sequelize
      .query(
        `ALTER TABLE "${TABLE_NAME}" ADD COLUMN "${COLUMN_NAME}" TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', ${SEARCH_FIELDS.join(
          " || ' ' || "
        )})) STORED;`
      )
      .then(() => {
        console.log('Values added: Creating Index');
        return sequelize
          .query(`CREATE INDEX ${INDEX_NAME} ON "${TABLE_NAME}" USING gin("${COLUMN_NAME}");`)
          .catch(console.log);
      });
  },
  async down(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;

    return sequelize
      .query(`DROP INDEX ${INDEX_NAME} ON "${TABLE_NAME}"`)
      .then(() => {
        console.log('removed index');
        return sequelize.query(`ALTER TABLE "${TABLE_NAME}" DROP COLUMN "${COLUMN_NAME}"`).catch(console.log);
      })
      .then(() => {
        console.log('removed column');
      });
  },
};
