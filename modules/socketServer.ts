import { Server } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  setup(_, nuxt) {
    const users = {};
    nuxt.hook("listen", (server) => {
      const io = new Server(server);
      console.debug("socket created");

      nuxt.hook("close", () => io.close());

      io.on("connection", (socket) => {
        console.info("new connection established with client on", socket.id);
        socket.emit(
          "welcome",
          `welcome to the server, ${socket.id}`
          // could add user alias in addition to id
        );

        socket.broadcast.emit("message", `${socket.id} joined the convo`);

        socket.on("message", (data) => {
          console.info("new message received from", socket.id, data);
          socket.broadcast.emit("message", data);
        });

        socket.on("disconnecting", () => {
          console.info("disconnected", socket.id);
          socket.broadcast.emit("message", `${socket.id} left the convo`);
        });
      });

      console.debug(
        "socket listening on",
        server.address(),
        server.eventNames()
      );
    });
  },
});
