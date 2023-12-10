import { SequelizeStorage, Umzug } from 'umzug';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { db } from './db/index.js';
import { DataTypes } from 'sequelize';

await db.init();

export const migrator = new Umzug({
  migrations: {
    glob: ['db/migrations/*.js', { cwd: __dirname }],
    resolve: (params) => {
      const getModule = () => import(params.path);

      return {
        name: params.name,
        up: async (params) => (await getModule()).default.up(params.context.queryInterface, DataTypes),
        down: async (params) => (await getModule()).default.down(params.context.queryInterface, DataTypes),
      };
    },
  },
  context: db.sequelize,
  storage: new SequelizeStorage({ sequelize: db.sequelize }),
  logger: console,
});

migrator.runAsCLI();
