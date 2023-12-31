import { PostgresPubSub } from 'graphql-postgres-subscriptions';
import pkg from 'pg';

import { SQL_URI } from './config.js';

const { Client } = pkg;

const client = new Client({
  connectionString: SQL_URI,
});
await client.connect();
const pubsub = new PostgresPubSub({ client });

export default pubsub;
