import type { SVGAttributes } from "vue";
import type { DeepPartial } from "@/utils/UseType";
import Preset from "@/components/MyGraphFlow/preset";

const pathMap = Preset.GFConnectionPath;
export type PathType = keyof typeof pathMap;
export type PathPosition = {
  sX: number;
  sY: number;
  tX: number;
  tY: number;
};

export type PathOptions = {
  type: PathType;
  position: PathPosition;
  attributes: SVGAttributes;
  drawPath: (position: PathPosition) => string;
};

export type DP_PathOpions = DeepPartial<PathOptions> &
  Pick<PathOptions, "position">;

export class Path {
  options: PathOptions;

  constructor(options: DP_PathOpions) {
    const { type = "line" } = options;
    defaultsDeep(options, pathMap[type], { type });

    const { attributes, position, drawPath } = <PathOptions>options;

    if (attributes.d === undefined) {
      attributes.d = drawPath(position);
    }

    this.options = reactive(<PathOptions>options);
  }

  get attributes() {
    return this.options.attributes;
  }
}
