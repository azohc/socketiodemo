<template>
  <div class="absolute top-0 left-0 m-2 flex gap-2">
    <!-- <div v-if="user !== null && user.email"> -->
    <Button @button-clicked="register" variant="primary">register</Button>
    <Button @button-clicked="login" variant="primary">log in</Button>
    <!-- </div> -->
    <!-- <div v-else> -->
    hello {{ user?.email }}
    <!-- </div> -->
  </div>
  <NotificationCorner :notifications="notifications" />
  <div v-if="clientAlias === ''">
    <AliasSetter @alias-submitted="setAlias" />
  </div>
  <div v-else class="flex flex-col gap-2 sm:flex-row">
    <UserPanel :users="users" />
    <div class="flex flex-col gap-2 w-[80vw] sm:w-[60vw]">
      <MessageList :messages="messages" :typingUsers="typingUsers" />
      <div class="flex gap-2">
        <input
          ref="focusTarget"
          class="text-black flex-grow"
          type="text"
          v-model="textInput"
          @keyup.enter="submitMessage"
          @keyup="emitTyping"
        />
        <Button variant="default" @button-clicked="submitMessage">send</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageData, UserData } from "./types";
import { useThrottleFn } from "@vueuse/core";
import Button from "./components/Button.vue";
import { User } from "@firebase/auth";

const focusTarget = ref<HTMLElement>();
useFocus(focusTarget, { initialValue: true });

const emitTyping = useThrottleFn((event: KeyboardEvent) => {
  if (socket && event.code !== "Enter") {
    socket.emit("typing");
  }
}, 500);

const typingUsers = ref<Array<string>>([]);
const clientAlias = ref<string>("");

const config = useRuntimeConfig();
const uri = config.public.wssUri;

const users = ref<Array<UserData>>([]);
const messages = ref<Array<MessageData>>([]);
const notifications = ref<Array<any>>([]);
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

const { user, login, register } = useFirebase();
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

  socket.on("typing", (usersTyping: Array<string>) => {
    typingUsers.value = usersTyping.filter(
      (alias) => alias !== clientAlias.value
    );
  });

  socket.on("userschanged", (userss: Array<UserData>) => {
    users.value = userss;
  });

  console.log("fbuser", user.value);
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
