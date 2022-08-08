<script setup lang="ts">
import { Path } from "@/components/MyGraphFlow";

interface Props {
  path: Path;
}

const { path } = defineProps<Props>();
</script>

<template>
  <svg class="absolute top-0 left-0 w-full h-full -z-10">
    <g>
      <path v-bind="path.attributes" />
    </g>
  </svg>
</template>
