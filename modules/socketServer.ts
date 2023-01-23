import { Server } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", (server) => {
      const io = new Server(server);
      console.log("socket created");

      const chance = 0.3;
      let messagesSent = 0;

      io.on("connection", (socket) => {
        console.log("new connection established with client on", socket.id);
        socket.emit(
          "welcome",
          `welcome to the random message server\nyou can kind of expect an emission of a \`message\` event every second (there's a ${
            chance * 100
          }% chance for the server to send the message)`
        );

        setInterval(() => {
          if (Math.random() < chance) {
            socket.emit("message", `random message number ${++messagesSent}`);
          }
        }, 1000);
        socket.on("message", (data) =>
          console.log("[message from client]", data)
        );
      });

      console.log("socket listening on", server.address(), server.eventNames());
    });
  },
});
