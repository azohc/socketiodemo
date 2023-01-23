import { Server } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", (server) => {
      const io = new Server(server);
      console.log("socket created");

      const chance = 0.3;
      let messagesSent = 0;

      nuxt.hook("close", () => io.close());

      io.on("connection", (socket) => {
        console.log("new connection established with client on", socket.id);
        socket.emit(
          "welcome",
          `welcome to the server, ${socket.id}`
          // could add user alias in addition to id
        );

        socket.broadcast.emit("message", `${socket.id} joined the convo`);

        socket.on("message", (data) => {
          console.log("message received from", socket.id, data);
          socket.broadcast.emit("message", data);
        });

        socket.on("disconnecting", () => {
          console.log("disconnected", socket.id);
          socket.broadcast.emit("message", `${socket.id} left the convo`);
        });
      });

      console.log("socket listening on", server.address(), server.eventNames());
    });
  },
});
