import {
  type GraphFlowOptions,
  linePathDraw,
  bezierPathDraw,
  PathType,
  PathPositionType,
  GraphFlow,
} from "@/components/MyGraphFlow";

export default defineStore("graphFlow", () => {
  const preset = {
    graphFlowType: "digraph" as const,
    path: {
      type: PathType.Bezier,
      positions: {
        type: PathPositionType.Right,
        sourceRect: {},
        targetRect: {},
        curvature: 0.25,
      },
      map: {
        [PathType.Line]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          pathDraw: linePathDraw,
        },
        [PathType.Bezier]: {
          attributes: {
            class: ["stroke-gray-400", "stroke-1", "fill-transparent"],
          },
          pathDraw: bezierPathDraw,
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
  };

  function createGraphFlow(options: GraphFlowOptions) {
    return new GraphFlow(options);
  }

  return {
    preset,
    createGraphFlow,
  };
});
