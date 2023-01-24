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
      function broadcast(
        eventName: string,
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
        socket.broadcast.emit(eventName, data);
      }

      io.on("connection", (socket) => {
        console.info("new connection established with client on", socket.id);
        socket.emit("welcome", `welcome to the server, ${socket.id}`);

        setTimeout(
          () => broadcast("callout", socket, `${socket.id} joined the convo`),
          3000
        );

        socket.on("message", (message: string) => {
          broadcast("message", socket, message);
        });

        socket.on("setalias", (alias) => {
          users.set(socket.id, alias);
          broadcast("callout", socket, `${socket.id} has renamed to ${alias}`);
          socket.emit("welcome", `your display name was changed to ${alias}`);
        });

        socket.on("disconnecting", () => {
          console.info("disconnected", socket.id);
          broadcast("callout", socket, `${socket.id} left the convo`);
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
