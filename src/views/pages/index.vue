<script setup lang="ts">
const router = useRouter();
function onClick() {
  router.push("/examples/graphFlow");
}
</script>

<template>
  <div @click="onClick">Home</div>
</template>
