<template>
  <div>
    <ul ref="messageList" class="messages">
      <li
        class="message"
        :style="{ 'flex-flow': m.sender === null ? 'row-reverse' : 'row' }"
        v-for="m of messageLog"
      >
        <span class="flex gap-2">
          <span v-if="m.sender" class="text-opacity-75">{{
            m.sender + ":"
          }}</span>
          <span style="line-break: anywhere">
            {{ m.text }}
          </span>
        </span>
        <TimeLabel
          class="self-end"
          :date="new Date(m.timestamp)"
          :format="'HH:mm:ss'"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { MessageData } from "../types";

const props = defineProps<{ messages: Array<MessageData> }>();

const messageLog = toRef(props, "messages");
const messageList = ref<HTMLElement>();

const { y } = useScroll(messageList, {
  behavior: "smooth",
});

watch(
  messageLog,
  () => {
    nextTick(() => {
      if (messageList.value) {
        y.value = messageList.value.scrollHeight;
      }
    });
  },
  { deep: true }
);
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
