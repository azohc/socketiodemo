<template>
  <span>
    {{ formatDate(props.date) }}
  </span>
</template>

<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
const props = defineProps<{ date: Date; format: string }>();

function formatDate(date: Date): string {
  return useDateFormat(date, props.format).value;
}
</script>
