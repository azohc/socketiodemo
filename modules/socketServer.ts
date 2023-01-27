import { Server, Socket } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";
import { MessageData, UserData } from "~~/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { replaceLinks } from "../shared/replaceLinks";

export default defineNuxtModule({
  setup(_, nuxt) {
    const userMap = new Map<string, UserData>();

    function getUsersObject() {
      return [...userMap.values()];
    }

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
        eventName: MessageData["type"],
        socket: Socket<
          DefaultEventsMap,
          DefaultEventsMap,
          DefaultEventsMap,
          any
        >,
        text: string
      ) {
        if (eventName === "link") {
          text = replaceLinks(text);
        }
        const data: MessageData = {
          text,
          sender: userMap.get(socket.id)?.alias || socket.id,
          timestamp: new Date().toString(),
          type: eventName,
        };
        socket.broadcast.emit(eventName, data);
      }

      io.on("connection", (socket) => {
        console.info("new connection established with client on", socket.id);
        socket.emit("welcome", `welcome to the server, ${socket.id}`);

        socket.on("message", (message: string) => {
          broadcastMessage("message", socket, message);
        });

        socket.on("link", (message: string) => {
          broadcastMessage("link", socket, message);
        });

        socket.on("setalias", (alias) => {
          userMap.set(socket.id, { alias, online: true, typing: false });
          socket.emit("userschanged", getUsersObject());
          socket.broadcast.emit("userschanged", getUsersObject());
          broadcastMessage("callout", socket, `${alias} joined the convo`);
          socket.emit("welcome", `your display name was changed to ${alias}`);
        });

        let typingTimeout: NodeJS.Timeout;
        let typingTime = 1000;
        socket.on("typing", () => {
          const updateTyping = (typing: boolean) => {
            setUserTyping(socket.id, typing);
            socket.broadcast.emit("typing", usersTypingArray());
            socket.broadcast.emit("userschanged", getUsersObject());
          };

          if (userIsTyping(socket.id)) {
            clearInterval(typingTimeout);
            typingTimeout = setTimeout(() => {
              updateTyping(false);
            }, typingTime);
          } else {
            updateTyping(true);
            typingTimeout = setTimeout(() => {
              updateTyping(false);
            }, typingTime);
          }
        });

        socket.on("disconnecting", () => {
          console.info("disconnected", socket.id);
          broadcastMessage("callout", socket, `${socket.id} left the convo`);

          const userData = userMap.get(socket.id);
          if (!userData) {
            throw new Error(
              `user with id=${socket.id} doesn't exist on userMap=${[
                ...userMap.entries(),
              ]}`
            );
          }
          userMap.set(socket.id, { ...userData, online: false });

          if (userMap.size > 8) {
            userMap.forEach((value: UserData, key: string) => {
              if (!value.online) {
                userMap.delete(key);
              }
            });
          }
          socket.broadcast.emit("userschanged", getUsersObject());
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
