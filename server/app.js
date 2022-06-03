const io = require("socket.io")(5000, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("connected");
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ chatters, message }) => {
    chatters.forEach((chatter) => {
      const newChatters = chatters.filter((c) => c !== chatter);
      newChatters.push(id);
      socket.broadcast.to(chatter).emit("receive-message", {
        chatters: newChatters,
        sender: id,
        message,
      });
    });
  });
});
