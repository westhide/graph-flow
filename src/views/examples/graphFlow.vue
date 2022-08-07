<script setup lang="ts">
const pathOptions = {
  position: { sX: 10, sY: 10, tX: 500, tY: 500 },
};
function onClick() {
  console.log("click");
}
</script>

<template>
  <MyGraphFlow v-bind="{ onClick }" />
  <MyGraphFlowNode />
  <div>MyGraphFlowConnectionLine</div>
  <MyGraphFlowConnectionPath :options="pathOptions" />
</template>
