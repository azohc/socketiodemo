<template>hello {{ user!.email }}</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
const { user } = useFirebase();
</script>
