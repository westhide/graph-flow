<script setup lang="ts">
import {
  type PartialPathOpions,
  Path,
  PathType,
  PathPositionType,
} from "@/components/MyGraphFlow";

const pathOptions: PartialPathOpions = {
  type: PathType.Bezier,
  position: {
    type: PathPositionType.Right,
    sourceX: 100,
    sourceY: 100,
    targetX: 500,
    targetY: 500,
  },
};
const path = new Path(pathOptions);
function onClick() {
  path.options.position.sourceX += 100;
  console.log("click");
}
</script>

<template>
  <MyGraphFlow v-bind="{ onClick }" />
  <MyGraphFlowNode />
  <MyGraphFlowEdgePath :path="path" />
</template>
