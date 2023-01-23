<template>
  <ul class="notifications">
    <li v-for="n of notifications">
      <span>
        {{ n.data }}
      </span>
      <TimeLabel :date="n.timestamp" :format="'HH:mm:ss'" />
    </li>
  </ul>
  <ul class="">
    <li class="flex" v-for="m of messages">
      <TimeLabel :date="m.timestamp" :format="'HH:mm:ss'" />
      <span>
        {{ m.data }}
      </span>
    </li>
  </ul>
  <button @click="handleClick">send</button>
</template>

<script setup lang="ts">
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const messages = ref<Array<any>>([]);
const notifications = ref<Array<any>>([]);
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

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

function handleClick() {
  if (socket) {
    sendMessage("ass");
  }
}

function sendMessage(message: string) {
  if (socket) {
    socket.emit("message", message);
    messages.value.push({ data: message, timestamp: new Date() });
  }
}
</script>

<style>
body {
  margin: 0;
}

ul.messages {
  display: inline-block;
  background-color: #ccc;
  color: black;
  list-style: none;
  padding: 0;
  margin: 0;
}
ul.notifications {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #333;
  color: white;
  list-style: none;
  padding: 1rem 1rem;
  margin: 0;
  border-bottom-left-radius: 8px;
}
</style>
