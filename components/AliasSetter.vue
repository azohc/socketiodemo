<template>
  <div class="bg-slate-300 text-black flex gap-4">
    <label for="aliasInput">set your display name for the server</label>
    <input
      type="text"
      id="aliasInput"
      v-model="aliasInput"
      @keyup.enter="submitAlias"
      maxlength="11"
      placeholder="maxlength11"
    />
    <button @click="submitAlias" :disabled="aliasInput === ''">submit</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["aliasSubmitted"]);
const aliasInput = ref("");

function submitAlias() {
  if (aliasInput.value) {
    emit("aliasSubmitted", aliasInput.value);
  }
}
</script>
