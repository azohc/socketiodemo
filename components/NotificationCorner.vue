<template>
  <ul class="notifications" :class="{ revealed: isRevealed }">
    <li v-for="n of notificationLog">
      <span class="px-4">
        {{ n.data }}
      </span>
      <TimeLabel :date="n.timestamp" :format="'HH:mm:ss'" />
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{ notifications: Array<any> }>();
const notificationLog = toRef(props, "notifications");
const isRevealed = ref(false);
const TIME_TO_HIDE = 3000;
let hideTimeout: NodeJS.Timeout;

watch(
  notificationLog,
  () => {
    if (!isRevealed.value) {
      isRevealed.value = true;
      hideTimeout = setTimeout(() => {
        isRevealed.value = false;
      }, TIME_TO_HIDE);
    } else {
      clearInterval(hideTimeout);
      hideTimeout = setTimeout(() => {
        isRevealed.value = false;
      }, TIME_TO_HIDE);
    }
  },
  { deep: true }
);
</script>

<style scoped>
ul.notifications {
  text-align: end;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #333;
  color: white;
  list-style: none;
  padding: 1rem 1rem;
  margin: 0;
  border-bottom-left-radius: 8px;
  opacity: 0.66;
  transform: translateY(-1rem) translateX(55vw);
  transition: all 400ms;
}
ul.notifications:hover,
ul.revealed {
  opacity: 1;
  transform: translateX(0) translateY(0);
}
</style>
