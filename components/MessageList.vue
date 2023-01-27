<template>
  <div ref="messageList" class="messages rounded-sm pr-1">
    <div
      v-for="m of messageLog"
      class="px-1 flex justify-between"
      :class="
        m.type === 'callout'
          ? 'w-2/3 px-4 my-3 text-sm  mx-auto rounded p-1.5 bg-slate-400'
          : 'my-2 gap-2'
      "
      :style="{
        'flex-flow': getFFlow(m),
      }"
    >
      <span v-if="m.type === 'message'" class="hyphenate" lang="es">
        <!-- if m.sender = null => its my own message -->
        <span v-if="m.sender" class="text-opacity-75">{{
          m.sender + ":"
        }}</span>
        <span class="hyphenate" lang="es"> {{ m.text }}</span>
      </span>
      <span v-else-if="m.type === 'callout'">
        {{ m.text }}
      </span>
      <img v-else-if="m.type === 'img'" :src="m.text" />
      <span v-else-if="m.type === 'link'" class="text-purple-900 flex gap-2">
        <span v-if="m.sender" class="text-opacity-75">{{
          m.sender + ":"
        }}</span>
        <a :href="m.text" target="_blank">
          {{ m.text }}
        </a>
      </span>
      <TimeLabel
        class="self-end text-slate-700 text-opacity-75"
        :date="new Date(m.timestamp)"
        :format="'HH:mm:ss'"
      />
    </div>
    <span
      class="flex gap-2 px-1.5 relative bottom-0 text-black text-opacity-50 italic"
    >
      <span v-for="(alias, index) in typingUsers">
        <span>{{ alias }}</span>
        <span v-if="index === typingUsers.length - 2"> and </span>
        <span v-else-if="index < typingUsers.length - 2">,</span>
      </span>
      <span v-if="typingUsers.length === 1">
        <span>is typing</span>
        <TypingEllipsis />
      </span>
      <span v-else-if="typingUsers.length > 1">
        <span>are typing</span>
        <TypingEllipsis />
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { MessageData } from "../types";

const props = defineProps<{
  messages: Array<MessageData>;
  typingUsers: Array<string>;
}>();

const { messages: messageLog, typingUsers } = toRefs(props);
const messageList = ref<HTMLElement>();

const { y } = useScroll(messageList, {
  behavior: "smooth",
});

const isMyOwnMessage = (m: MessageData) => {
  return m.sender === null;
};

watch(
  [messageLog, typingUsers],
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
  if (m.type === "callout") {
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
  height: 50vh;
  overflow-y: scroll;
}

.hyphenate {
  word-break: break-word;
  hyphens: auto;
}
</style>
