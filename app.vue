<template>
  <NotificationCorner :notifications="notifications" />
  <MessageList :messages="messages" />
  <input
    class="text-black"
    type="text"
    v-model="textInput"
    @keyup.enter="submitMessage"
  />
  <button @click="submitMessage">send</button>
</template>

<script setup lang="ts">
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const messages = ref<Array<any>>([]);
const notifications = ref<Array<any>>([]);
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

const textInput = ref("");

onMounted(() => {
  const uri = "http://localhost:3000";
  socket = io(uri);
  console.log(`connected to socket @ ${uri}`);

  socket.on("welcome", (data) => {
    notifications.value.push({ data, timestamp: new Date() });
  });
  socket.on("message", (data) =>
    messages.value.push({ data, timestamp: new Date() })
  );
});

function submitMessage() {
  if (socket && textInput.value) {
    sendMessage(textInput.value);
    textInput.value = "";
  }
}

function sendMessage(message: string) {
  if (socket) {
    socket.emit("message", message);
    messages.value.push({ data: message, timestamp: new Date() });
  }
}
</script>
º
