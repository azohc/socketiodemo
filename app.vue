<template>
  <NotificationCorner :notifications="notifications" />
  <div v-if="clientAlias === ''">
    <AliasSetter @alias-submitted="setAlias" />
  </div>
  <div v-else>
    <MessageList :messages="messages" />
    <div class="flex gap-2">
      <input
        ref="focusTarget"
        class="text-black flex-grow"
        type="text"
        v-model="textInput"
        @keyup.enter="submitMessage"
      />
      <Button variant="default" @button-clicked="submitMessage">send</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageData } from "./types";

const focusTarget = ref<HTMLElement>();
useFocus(focusTarget, { initialValue: true });

const clientAlias = ref("");

const config = useRuntimeConfig();
const uri = config.public.wssUri;

const messages = ref<Array<MessageData>>([]);
const notifications = ref<Array<any>>([]);
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

const textInput = ref("");

onMounted(() => {
  socket = io(uri);
  console.log(`connected to socket @ ${uri}`);

  socket.on("welcome", (data) => {
    notifications.value.push({ data, timestamp: new Date() });
  });

  socket.on("message", (message: MessageData) => messages.value.push(message));

  socket.on("callout", (message: MessageData) =>
    messages.value.push({ ...message, sender: "admin" })
  );
});

function setAlias(alias: string) {
  if (socket) {
    socket.emit("setalias", alias);
    clientAlias.value = alias;
  }
}

function submitMessage() {
  if (socket && textInput.value) {
    sendMessage(textInput.value);
    textInput.value = "";
  }
}

function sendMessage(message: string) {
  if (socket) {
    socket.emit("message", message);
    messages.value.push({
      text: message,
      sender: null,
      timestamp: new Date().toString(),
    });
  }
}
</script>
