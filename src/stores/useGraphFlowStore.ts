import {
  type GraphFlowOptions,
  linePathDraw,
  curvePathDraw,
  stepPathDraw,
  PathType,
  PositionType,
  GraphFlow,
} from "@/components/MyGraphFlow";

export default defineStore("graphFlow", () => {
  const preset = {
    graphFlowType: "digraph" as const,
    path: {
      type: PathType.Step,
      positions: {
        sourceType: PositionType.Right,
        targetType: PositionType.Left,
        sourceOffset: { x: 0, y: 0 },
        targetOffset: { x: 0, y: 0 },
        curvature: 0.25,
        stepCornerSize: 4,
      },
      cases: {
        [PathType.Line]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          draw: linePathDraw,
        },
        [PathType.Curve]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          draw: curvePathDraw,
        },
        [PathType.Step]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          draw: stepPathDraw,
        },
      },
    },
    endpoint: {
      label: "Dot",
      draggable: false,
    },
    node: {
      label: "Node",
      draggable: true,
    },
    treeFlow: {
      basePoint: { x: 10, y: 10 },
      depthSpace: 120,
      rowSpace: 30,
    },
  };

  function createGraphFlow(options: GraphFlowOptions) {
    return new GraphFlow(options);
  }

  return {
    preset,
    createGraphFlow,
  };
});
