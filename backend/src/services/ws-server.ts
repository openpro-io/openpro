export const handleConnection = ({ socket, req, context, clients }) => {
  socket.send(JSON.stringify({ type: 'HELLO', payload: { message: 'hi from server' } }));

  // TODO: For now we dont get messages from the browser we only send...
  socket.on('message', (message) => {
    let msg = message.toString();

    if (['ping', 'pong'].includes(msg)) return;

    msg = JSON.parse(msg);

    if (msg.type === 'NOTIFICATION') {
      websocketBroadcast({ clients, namespace: 'ws', message: JSON.stringify(msg) });
    }
  });
};

export const websocketBroadcast = ({
  clients,
  message,
  namespace,
}: {
  clients: Array<any>;
  message: string;
  namespace?: string;
}) => {
  clients.forEach((client) => {
    if (namespace && client.namespace === namespace) {
      client.send(message);
    }
  });
};
