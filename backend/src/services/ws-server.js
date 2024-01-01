export const handleConnection = ({ socket, req, context, clients }) => {
  socket.send(JSON.stringify({ type: 'HELLO', payload: { message: 'hi from server' } }));

  // TODO: For now we dont get messages from the browser we only send...
  // socket.on('message', (message) => {
  //   console.log('message', message.toString());
  // });
};

/**
 * Broadcasts a message to all connected clients in a specific namespace.
 *
 * @param {object} args - The function arguments.
 * @param {Array} args.clients - The array of connected clients.
 * @param {string} args.message - The message to be sent.
 * @param {string} [args.namespace] - The namespace in which to broadcast the message. Optional.
 */
export const websocketBroadcast = ({ clients, message, namespace }) => {
  clients.forEach((client) => {
    if (namespace && client.namespace === namespace) {
      client.send(message);
    }
  });
};
