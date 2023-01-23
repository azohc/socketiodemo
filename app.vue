<template>
  <h1>random message stack</h1>
  <ul>
    <li v-for="msg of messages">
      <span>
        {{ msg.data }}
      </span>
      <TimeLabel :date="msg.timestamp" :format="'HH:mm:ss'" />
    </li>
  </ul>
  <button @click="handleClick">send</button>
</template>

<script setup lang="ts">
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const messages = ref<Array<any>>([]);
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

onMounted(() => {
  const uri = "http://localhost:3000";
  socket = io(uri);
  console.log(`connected to socket @ ${uri}`);

  socket.on("welcome", (data) => {
    console.log(data);
  });
  socket.on("message", (data) => {
    console.log(data);
    messages.value.push({ data, timestamp: new Date() });
  });
});

function handleClick() {
  if (socket) {
    console.log("sending message...");
    socket.emit("message", "wuwawiwawu");
  }
}
</script>
