<template>
  <div>
    <ul class="messages">
      <li class="message" v-for="m of props.messages">
        <span>
          <span>nick</span>
          {{ " " }}
          <span style="line-break: anywhere">
            {{ m.data }}
          </span>
        </span>
        <TimeLabel class="self-end" :date="m.timestamp" :format="'HH:mm:ss'" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ messages: Array<any> }>();
</script>

<style scoped>
ul.messages {
  font-size: 14px;
  display: inline-block;
  background-color: #ccc;
  color: black;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 40vh;
  width: 55vw;
  overflow-y: scroll;
}
li.message {
  display: flex;
  justify-content: space-between;
}
</style>
