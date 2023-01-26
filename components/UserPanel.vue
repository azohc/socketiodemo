<template>
  <div
    class="h-fit max-h-20 rounded-sm sm:max-h-fit sm:w-40 bg-slate-500 text-slate-900 flex flex-col flex-wrap"
  >
    <div v-for="user in users" class="px-3 w-40">
      <span
        class="font-extrabold text-green-600"
        :class="{ 'text-red-600': !user.online }"
      >
        •
      </span>
      <span :class="{ 'text-opacity-60': !user.online }">
        {{ user.alias }}
      </span>
      <TypingEllipsis v-if="user.typing" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserData } from "../types";
defineProps<{ users: Array<UserData> }>();
</script>
