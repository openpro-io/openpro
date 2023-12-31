export const handleConnection = (socket, req, context) => {
  //       // verify token
  //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //       // add user to the context
  //       user = await db.User.findByPk(decoded.id);
  //     } catch (err) {
  // console.log(socket);
  socket.send('hi from server');
};
