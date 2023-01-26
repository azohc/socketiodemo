<template>
  <button :class="cc" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant: "primary" | "secondary" | "default";
  disabled?: boolean;
}>();
const emit = defineEmits(["buttonClicked"]);

const cc = computed(() => {
  const classes = "bg-slate-200 text-black px-1 border-2 rounded ";
  const classesAccountingForDisabled = props.disabled
    ? "text-opacity-50 cursor-not-allowed cursor-not-allowed "
    : "hover:bg-slate-100 hover:border-slate-400 cursor-pointer ";
  switch (props.variant) {
    case "primary":
      return classes.concat(classesAccountingForDisabled).concat("");
      break;
    case "secondary":
      return classes.concat(classesAccountingForDisabled).concat("");
      break;
    case "default":
      return classes.concat(classesAccountingForDisabled);
      break;
    default:
      throw new Error("impossible");
  }
});

function handleClick() {
  emit("buttonClicked");
}
</script>
