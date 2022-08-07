import type { PathPosition } from "./Connection/utils/path";

export default {
  GFConnectionPath: {
    line: {
      attributes: {
        class: ["stroke-gray-400", "stroke-1"],
      },
      drawPath(position: PathPosition) {
        const { sX, sY, tX, tY } = position;
        return `M${sX},${sY} ${tX},${tY}`;
      },
    },
  },
};
