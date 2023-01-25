import { Server, Socket } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";
import { MessageData, UserData } from "~~/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default defineNuxtModule({
  setup(_, nuxt) {
    const userMap = new Map<string, UserData>();
    function usersTypingArray(): Array<string> {
      return [...userMap.entries()]
        .filter(([id, userData]) => userData.online && userData.typing)
        .map(([id, userData]) => userData.alias);
    }

    function setUserTyping(id: string, typing: boolean) {
      const userData = userMap.get(id);
      if (!userData) {
        throw new Error(
          `user with id=${id} doesn't exist on userMap=${[
            ...userMap.entries(),
          ]}`
        );
      }
      userMap.set(id, { ...userData, typing });
    }

    function userIsTyping(id: string): boolean {
      const userData = userMap.get(id);
      if (!userData) {
        throw new Error(
          `user with id=${id} doesn't exist on userMap=${[
            ...userMap.entries(),
          ]}`
        );
      }
      return userData.typing;
    }

    nuxt.hook("listen", (server) => {
      const io = new Server(server);
      nuxt.hook("close", () => io.close());
      console.debug("socket created");

      function broadcastMessage(
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
          sender: userMap.get(socket.id)?.alias || socket.id,
          timestamp: new Date().toString(),
        };
        socket.broadcast.emit(eventName, data);
      }

      io.on("connection", (socket) => {
        console.info("new connection established with client on", socket.id);
        socket.emit("welcome", `welcome to the server, ${socket.id}`);

        setTimeout(
          () =>
            broadcastMessage(
              "callout",
              socket,
              `${socket.id} joined the convo`
            ),
          3000
        );

        socket.on("message", (message: string) => {
          broadcastMessage("message", socket, message);
        });

        socket.on("setalias", (alias) => {
          userMap.set(socket.id, { alias, online: true, typing: false });
          broadcastMessage(
            "callout",
            socket,
            `${socket.id} has renamed to ${alias}`
          );
          socket.emit("welcome", `your display name was changed to ${alias}`);
        });

        let typingTimeout: NodeJS.Timeout;
        let typingTime = 1000;
        socket.on("typing", () => {
          if (userIsTyping(socket.id)) {
            clearInterval(typingTimeout);
            typingTimeout = setTimeout(() => {
              setUserTyping(socket.id, false);
              socket.broadcast.emit("typing", usersTypingArray());
            }, typingTime);
          } else {
            setUserTyping(socket.id, true);
            socket.broadcast.emit("typing", usersTypingArray());
            typingTimeout = setTimeout(() => {
              setUserTyping(socket.id, false);
              socket.broadcast.emit("typing", usersTypingArray());
            }, typingTime);
          }
        });

        socket.on("disconnecting", () => {
          console.info("disconnected", socket.id);
          broadcastMessage("callout", socket, `${socket.id} left the convo`);
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
