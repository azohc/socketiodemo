<template>
  <div class="bg-slate-500 text-slate-900">
    <!-- TODO add user list -->
    <div v-for="user in ['asdf', ' gfdsf', 'asd']">
      {{ user }}
      <!-- TODO Add online/offline indicator -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserData } from "../types";
const props = defineProps<{ users: Array<UserData> }>();
</script>
