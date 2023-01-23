<template>
  <div>helo</div>
</template>

<script setup lang="ts">
import io from "socket.io-client";

onMounted(() => {
  const uri = "http://localhost:3000";
  const socket = io(uri);
  console.log(`connected to socket @ ${uri}`);

  socket.on("welcome", (data) => {
    console.log(data);
  });
});
</script>
