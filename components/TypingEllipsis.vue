<template>
  <span>{{ ellipsis }}</span>
</template>

<script setup lang="ts">
let interval: NodeJS.Timer;
let increasing = true;
const ellipsis = ref<string>(".");

function updateEllipsis() {
  if (increasing) {
    ellipsis.value += ".";
    if (ellipsis.value.length === 3) {
      increasing = false;
    }
  } else {
    if (!ellipsis.value.length) {
      increasing = true;
    }
    ellipsis.value = ellipsis.value.substring(0, ellipsis.value.length - 1);
  }
}

interval = setInterval(updateEllipsis, 400);

onUnmounted(() => clearInterval(interval));
</script>
