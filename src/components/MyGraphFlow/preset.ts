import { linePathDraw, bezierPathDraw } from "@/components/MyGraphFlow";

export const enum PathType {
  Line = "line",
  Bezier = "bezier",
}

export default {
  GFEdgePath: {
    type: PathType.Line,
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
};
