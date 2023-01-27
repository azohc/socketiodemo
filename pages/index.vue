<template>
  <div class="absolute top-0 left-0 m-2">
    <div v-if="user === null" class="flex gap-2 items-baseline">
      <Button @button-clicked="register" variant="primary">register</Button>
      <Button @button-clicked="login" variant="primary">log in</Button>
      <Button @button-clicked="glogin" variant="primary">google log in</Button>
    </div>
    <div v-else class="flex gap-2 items-baseline">
      <NuxtLink to="/user">{{ user?.email }}</NuxtLink>
      <Button @button-clicked="logout" variant="primary">log out</Button>
    </div>
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
          maxlength="222"
        />
        <Button variant="default" @button-clicked="submitMessage">send</Button>
      </div>
      <!-- TODO REMOVE -->
      <!-- <Button
        class="opacity-20 hover:opacity-100"
        :class="{ 'opacity-100': typing }"
        variant="default"
        @button-clicked="toggleTypingSim"
        >{{ typing ? "stop typing" : "start typing" }}</Button
      > -->
    </div>
  </div>
</template>

<script setup lang="ts">
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageData, UserData } from "../types";
import { useThrottleFn } from "@vueuse/core";
import { replaceLinks } from "~~/shared/replaceLinks";

const focusTarget = ref<HTMLElement>();
useFocus(focusTarget, { initialValue: true });

let typing = ref(false),
  interval: NodeJS.Timer;
const toggleTypingSim = () => {
  typing.value = !typing.value;
  if (typing.value) {
    interval = setInterval(() => socket?.emit("typing"), 400);
  } else {
    clearInterval(interval);
  }
};

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

const { user, login, glogin, register, logout } = useFirebase();
const textInput = ref("");

onMounted(() => {
  socket = io(uri);
  console.log(`connected to socket @ ${uri}`);

  socket.on("welcome", (data) => {
    notifications.value.push({ data, timestamp: new Date() });
  });

  socket.on("message", (message: MessageData) => messages.value.push(message));

  socket.on("link", (message: MessageData) => messages.value.push(message));

  socket.on("callout", (message: MessageData) => messages.value.push(message));

  socket.on("typing", (usersTyping: Array<string>) => {
    typingUsers.value = usersTyping.filter(
      (alias) => alias !== clientAlias.value
    );
  });

  socket.on("userschanged", (userss: Array<UserData>) => {
    users.value = userss.filter((user) => user.alias !== clientAlias.value);
  });
});

function setAlias(alias: string) {
  if (socket) {
    socket.emit("setalias", alias);
    clientAlias.value = alias;
  }
}

function submitMessage() {
  function containsURL(s: string) {
    const regexp =
      /.*(ftp|http|https|chrome|:\/\/|\.|@){2,}(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\S*:\w*@)*([a-zA-Z]|(\d{1,3}|\.){7}){1,}(\w|\.{2,}|\.[a-zA-Z]{2,3}|\/|\?|&|:\d|@|=|\/|\(.*\)|#|-|%)*.*/gmu;
    return regexp.test(s);
  }

  function validURL(s: string) {
    const regexp =
      /^(ftp|http|https|chrome|:\/\/|\.|@){2,}(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\S*:\w*@)*([a-zA-Z]|(\d{1,3}|\.){7}){1,}(\w|\.{2,}|\.[a-zA-Z]{2,3}|\/|\?|&|:\d|@|=|\/|\(.*\)|#|-|%)*$/gmu;
    return regexp.test(s);
  }

  if (socket && textInput.value) {
    let type = "message";
    if (containsURL(textInput.value)) {
      type = "link";
    }

    sendMessage(textInput.value, type as MessageData["type"]);
    textInput.value = "";
  }
}

function sendMessage(message: string, type: MessageData["type"]) {
  if (socket) {
    socket.emit(type, message);
    if (type === "link") {
      message = replaceLinks(message);
    }
    messages.value.push({
      type,
      text: message,
      sender: null,
      timestamp: new Date().toString(),
    });
  }
}
</script>
