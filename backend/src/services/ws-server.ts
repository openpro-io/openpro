export const handleConnection = ({ socket, req, context, clients }) => {
  socket.send(JSON.stringify({ type: 'HELLO', payload: { message: 'hi from server' } }));

  // TODO: For now we dont get messages from the browser we only send...
  // socket.on('message', (message) => {
  //   console.log('message', message.toString());
  // });
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
