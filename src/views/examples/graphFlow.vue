<script setup lang="ts">
import {
  PathType,
  PositionType,
  GraphFlowOptions,
} from "@/components/MyGraphFlow";
import { TreeFlow } from "@/components/MyGraphFlow/treeFlow";

const { createGraphFlow } = useGraphFlowStore();

// TODO: fix drag element position bug

const options: GraphFlowOptions = {
  nodes: [
    {
      id: "1",
      label: "银行存款",
      suffix: "arrowUp",
      suffixColor: "green",
      position: {
        x: 100,
        y: 200,
      },
    },
    {
      id: "2",
      label: "应收账款",
      suffix: "arrowDown",
      suffixColor: "blue",
      position: {
        x: 250,
        y: 100,
      },
    },
    {
      id: "3",
      label: "预收账款",
      suffix: "arrowUp",
      suffixColor: "yellow",
      position: {
        x: 250,
        y: 300,
      },
    },
    {
      id: "12345",
      showId: true,
      suffix: "arrowUp",
      suffixColor: "green",
      label: "主营业务收入",
      position: {
        x: 400,
        y: 200,
      },
    },
    {
      id: "5",
      label: "生产成本",
      suffix: "arrowUp",
      suffixColor: "red",
      position: {
        x: 100,
        y: 400,
      },
    },
    {
      id: "6",
      label: "管理费用",
      suffix: "arrowUp",
      suffixColor: "red",
      position: {
        x: 100,
        y: 450,
      },
    },
    {
      id: "7",
      label: "银行存款",
      suffix: "arrowDown",
      suffixColor: "orange",
      position: {
        x: 300,
        y: 350,
      },
    },
  ],
  relations: [
    {
      source: "1",
      target: "2",
    },
    {
      source: "1",
      target: "3",
      edge: {
        path: {
          positions: { targetType: PositionType.Top },
        },
      },
    },
    {
      source: "2",
      target: "12345",
      edge: {
        path: {
          type: PathType.Step,
          positions: {
            sourceType: PositionType.Right,
            targetType: PositionType.Left,
          },
        },
        endpoints: {
          source: {},
          target: {},
        },
      },
    },
    { source: "5", target: "7" },
    { source: "6", target: "7" },
  ],
};

const graphFlow1 = createGraphFlow(options);

function onClick() {
  console.log("click", graphFlow1);
  graphFlow1.nodes.get("1")!.label = "TestNode";
}

const treeFlow = new TreeFlow([
  {
    root: { label: "银行存款", data: { amount: "10,000" } },
    children: [
      {
        node: { label: "预收账款1", suffix: "arrowUp", suffixColor: "red" },
        children: [
          {
            node: {
              label: "应收账款1",
              suffix: "arrowDown",
              suffixColor: "orange",
              data: { amount: "10,000,000" },
            },
            children: [
              {
                node: {
                  label: "主营业务收入1",
                  suffix: "arrowUp",
                  suffixColor: "green",
                },
              },
              { node: { label: "主营业务收入2" } },
              { node: { label: "主营业务收入3" } },
              { node: { label: "主营业务收入4" } },
            ],
          },
          {
            node: {
              label: "应收账款2",
              suffix: "arrowDown",
              suffixColor: "blue",
            },
          },
          { node: { label: "应收账款3" } },
          { node: { label: "应收账款4" } },
        ],
      },
      {
        node: { label: "预收账款2", suffix: "arrowUp", suffixColor: "yellow" },
        children: [
          { node: { label: "应收账款5" } },
          {
            node: { label: "应收账款6" },
            children: [
              { node: { label: "主营业务收入5" } },
              { node: { label: "主营业务收入6" } },
              { node: { label: "主营业务收入7" } },
              { node: { label: "主营业务收入8" } },
            ],
          },
          { node: { label: "应收账款7" } },
          { node: { label: "应收账款8" } },
        ],
      },
      {
        node: { label: "预收账款3" },
        children: [{ node: { label: "主营业务收入9" } }],
      },
      { node: { label: "预收账款4" } },
      { node: { label: "预收账款5" } },
    ],
  },
]);
</script>

<template>
  <span @click="onClick">Split</span>
  <MyGraphFlow class="h-[600px] border border-black" :graph-flow="treeFlow">
    <div>Inner</div>
  </MyGraphFlow>
  <MyGraphFlow class="h-[500px] border border-black" :graph-flow="graphFlow1" />
</template>
