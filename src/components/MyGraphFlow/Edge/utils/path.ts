import type { SVGAttributes, WatchStopHandle } from "vue";
import Preset, { PathType } from "@/components/MyGraphFlow/preset";

const { type: dfPathType, map: pathMap } = Preset.GFEdgePath;

export const enum PathPositionType {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Float = "float",
}

export type PathPosition = {
  type?: PathPositionType;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceControlX?: number;
  sourceControlY?: number;
  targetControlX?: number;
  targetControlY?: number;
  curvature?: number;
};

export type PathOptions = {
  type: PathType;
  position: PathPosition;
  attributes: SVGAttributes;
  pathDraw: (position: PathPosition) => string;
};

export type PartialPathOpions = Partial<PathOptions>;

export class Path {
  options: PathOptions;
  stopWatch?: WatchStopHandle;

  constructor(options: PartialPathOpions) {
    const { type = dfPathType } = options;
    defaultsDeep(options, pathMap[type], { type });

    this.options = reactive(<PathOptions>options);

    const {
      position,
      attributes,
      attributes: { d },
      pathDraw,
    } = this.options;

    if (position === undefined && d === undefined)
      throw new Error(
        "draw path undefinde,please set position or attributes.d"
      );

    if (d === undefined) {
      if (position.type === undefined) position.type = PathPositionType.Right;
      this.stopWatch = watchEffect(() => {
        attributes.d = pathDraw(position);
      });
    }
  }

  get attributes() {
    return this.options.attributes;
  }
}
