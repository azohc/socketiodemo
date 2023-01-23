import { Server } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", (server) => {
      const io = new Server(server);
      console.log("socket created");

      io.on("connection", (socket) => {
        console.log("new connection established with client on", socket.id);
        socket.emit("welcome", "welcome to the server");
        socket.on("message", (data) => console.log("[message]", data));
      });

      console.log("socket listening on", server.address(), server.eventNames());
    });
  },
});
