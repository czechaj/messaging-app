const express = require("express");
const path = require("path");
const app = express();

//This will create a middleware.
//When you navigate to the root page, it would use the built react-app
app.use(express.static(path.resolve(__dirname, "../client/build")));

const io = require("socket.io")(process.env.PORT || 5000, {
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
