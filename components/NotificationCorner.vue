<template>
  <ul class="notifications">
    <li v-for="n of props.notifications">
      <span class="px-4">
        {{ n.data }}
      </span>
      <TimeLabel :date="n.timestamp" :format="'HH:mm:ss'" />
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{ notifications: Array<any> }>();
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
}
</style>
