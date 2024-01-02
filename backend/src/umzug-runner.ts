import { SequelizeStorage, Umzug } from 'umzug';
import { dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import db from './db/index.js';
import { DataTypes } from 'sequelize';

await db.init();

const getTables = await db.sequelize.getQueryInterface().showAllTables();

// This will look for migrations that have a file extension and strip it only if a migrations table exists
if (getTables.includes('SequelizeMeta')) {
  console.log(
    'Begin: Going to strip file extensions from migration names for compatibility'
  );

  const [results, metadata] = await db.sequelize.query(
    "UPDATE \"SequelizeMeta\" SET name = REPLACE(REPLACE(name, '.js', ''), '.ts', '') WHERE name LIKE '%._s';"
  );

  // @ts-ignore
  console.log(`End: Rows ${metadata?.rowCount} affected`);
}

export const migrator = new Umzug({
  migrations: {
    glob: ['db/migrations/*', { cwd: __dirname }],
    resolve: (params) => {
      const getModule = () => import(params.path);

      return {
        name: parse(params.name).name, // strip the extension
        up: async (params) =>
          (await getModule()).default.up(
            // @ts-ignore
            params.context.queryInterface,
            DataTypes
          ),
        down: async (params) =>
          (await getModule()).default.down(
            // @ts-ignore
            params.context.queryInterface,
            DataTypes
          ),
      };
    },
  },
  context: db.sequelize,
  storage: new SequelizeStorage({ sequelize: db.sequelize }),
  logger: console,
});

migrator.runAsCLI();
