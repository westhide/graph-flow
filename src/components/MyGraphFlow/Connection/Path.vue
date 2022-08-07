<script setup lang="ts">
import type { DP_PathOpions } from "./utils/path";
import { Path } from "./utils/path";

interface Props {
  options: DP_PathOpions;
}

const { options } = defineProps<Props>();

const path = new Path(options);
</script>

<template>
  <svg class="absolute top-0 left-0 w-full h-full">
    <g>
      <path v-bind="path.attributes" />
    </g>
  </svg>
</template>
