<template>
  <div class="text-center">
    <div>
      {{ user!.email }}
    </div>
    <NuxtLink to="/"
      ><Button @button-clicked="() => navigateTo('/')" variant="default"
        >back to chat</Button
      ></NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
const { user } = useFirebase();
</script>
