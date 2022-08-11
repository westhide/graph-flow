<script setup lang="ts">
import { Path, PathType, PathPositionType } from "@/components/MyGraphFlow";

const { createEdges, edges } = useGraphFlowStore();

const path = new Path({
  type: PathType.Bezier,
  position: {
    sourceX: 100,
    sourceY: 100,
    targetX: 500,
    targetY: 500,
  },
});

createEdges([
  {
    path,
    endpoints: {
      source: {
        draggable: true,
      },
      target: {
        draggable: true,
      },
    },
  },
  {
    path: {
      position: {
        type: PathPositionType.Top,
        sourceX: 500,
        sourceY: 100,
        targetX: 100,
        targetY: 500,
      },
    },
    endpoints: {
      source: {
        draggable: true,
      },
      target: {
        draggable: true,
      },
    },
  },
]);

function onClick() {
  createEdges([
    {
      path: {
        position: {
          type: PathPositionType.Top,
          sourceX: 300,
          sourceY: 300,
          targetX: 600,
          targetY: 600,
        },
      },
      endpoints: {
        source: {
          draggable: true,
        },
        target: {
          draggable: true,
        },
      },
    },
  ]);
  console.log("click", edges);
}
</script>

<template>
  <MyGraphFlow @click="onClick" />
  <MyGraphFlowNode />
  <div>Split</div>
  <MyGraphFlowEdge />
</template>
