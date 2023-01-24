<template>
  <div class="bg-slate-300 rounded-sm p-2 text-black flex gap-4 items-baseline">
    <label for="aliasInput">set your display name for the server</label>
    <input
      id="aliasInput"
      type="text"
      ref="focusTarget"
      v-model="aliasInput"
      @keyup.enter="submitAlias"
      maxlength="11"
      placeholder="maxlength11"
    />
    <Button
      variant="default"
      @button-clicked="submitAlias"
      :disabled="aliasInput === ''"
    >
      submit
    </Button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["aliasSubmitted"]);
const aliasInput = ref("");

const focusTarget = ref<HTMLElement>();
useFocus(focusTarget, { initialValue: true });

function submitAlias() {
  if (aliasInput.value) {
    emit("aliasSubmitted", aliasInput.value);
  }
}
</script>
