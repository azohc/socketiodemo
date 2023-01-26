import { defineEmits } from "vue";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const EVENT_WELCOME = "WELCOME";
export const EVENT_CALLOUT = "CALLOUT";
export const EVENT_TYPING = "TYPING";

export default defineNuxtPlugin((nuxtApp) => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

  const WSS_URI = useRuntimeConfig().public.wssUri;

  const emits = defineEmits([EVENT_WELCOME, EVENT_CALLOUT, EVENT_TYPING]);

  ////
  socket = io(WSS_URI);
  console.log(`connected to socket @ ${WSS_URI}`);

  // ret.setOnUserTyping = function (listener: (...args: any[]) => void) {
  //   socket?.on(EVENT_TYPING, listener);
  // };

  // ret.emitUserTyping = function (): void {
  //   socket?.emit(EVENT_TYPING);
  // };

  // socket.on("welcome", (data) => {
  //   notifications.value.push({ data, timestamp: new Date() });
  // });

  // socket.on("message", (message: MessageData) => messages.value.push(message));

  // socket.on("callout", (message: MessageData) =>
  //   messages.value.push({ ...message, sender: "admin" })
  // );

  // socket.on("userschanged", (userss: Array<UserData>) => {
  //   users.value = userss;
  // });

  nuxtApp.vueApp.provide("io", socket);
  nuxtApp.provide("io", socket);
});
