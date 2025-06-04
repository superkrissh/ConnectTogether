// server.js
const { Server } = require("socket.io");
const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", { code });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
