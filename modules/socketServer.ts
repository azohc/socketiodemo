import { Server, Socket } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";
import { MessageData } from "~~/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default defineNuxtModule({
  setup(_, nuxt) {
    // socket.id => nickname
    const users = new Map<string, string>();

    nuxt.hook("listen", (server) => {
      const io = new Server(server);
      console.debug("socket created");

      nuxt.hook("close", () => io.close());
      function broadcastMessage(
        socket: Socket<
          DefaultEventsMap,
          DefaultEventsMap,
          DefaultEventsMap,
          any
        >,
        text: string
      ) {
        const data: MessageData = {
          text,
          sender: users.get(socket.id) || socket.id,
          timestamp: new Date().toString(),
        };
        socket.broadcast.emit("message", data);
      }

      io.on("connection", (socket) => {
        console.info("new connection established with client on", socket.id);
        socket.emit("welcome", `welcome to the server, ${socket.id}`);

        broadcastMessage(socket, `${socket.id} joined the convo`);

        socket.on("message", (message: string) => {
          broadcastMessage(socket, message);
        });

        socket.on("setalias", (alias) => {
          users.set(socket.id, alias);
          broadcastMessage(socket, `${socket.id} has renamed to ${alias}`);
          socket.emit("welcome", `your display name was changed to ${alias}`);
        });

        socket.on("disconnecting", () => {
          console.info("disconnected", socket.id);
          broadcastMessage(socket, `${socket.id} left the convo`);
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
