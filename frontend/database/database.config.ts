import Dexie from 'dexie';

const database = new Dexie('openpro');

database.version(1).stores({
  notifications: 'id,subscriptionId,time,new,[subscriptionId+new]',
  subscriptions: 'id,baseUrl,[subscriptionId+new]',
});

export const notificationsTable = database.table('notifications');
export const subscriptionsTable = database.table('subscriptions');

export default database;
