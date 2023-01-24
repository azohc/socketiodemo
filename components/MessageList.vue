<template>
  <div>
    <div ref="messageList" class="messages">
      <div
        v-for="m of messageLog"
        class="px-1 flex justify-between"
        :class="
          isCallout(m) ? 'w-2/3 my-4 mx-auto rounded p-1.5 bg-slate-400' : ''
        "
        :style="{
          'flex-flow': getFFlow(m),
        }"
      >
        <span class="flex gap-2">
          <span
            v-if="m.sender && m.sender !== 'admin'"
            class="text-opacity-75"
            >{{ m.sender + ":" }}</span
          >
          <span style="line-break: anywhere">
            {{ m.text }}
          </span>
        </span>
        <TimeLabel
          class="self-end text-slate-700 text-opacity-75"
          :date="new Date(m.timestamp)"
          :format="'HH:mm:ss'"
        />
      </div>
    </div>
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

const isCallout = (m: MessageData) => {
  return m.sender === "admin";
};

const isMyOwnMessage = (m: MessageData) => {
  return m.sender === null;
};

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
const getFFlow = (m: MessageData) => {
  if (isCallout(m)) {
    return "column";
  } else if (isMyOwnMessage(m)) {
    return "row-reverse";
  } else {
    return "row";
  }
};
</script>

<style scoped>
div.messages {
  font-size: 14px;
  display: inline-block;
  background-color: #ccc;
  color: black;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 66vh;
  width: 55vw;
  overflow-y: scroll;
}
</style>
