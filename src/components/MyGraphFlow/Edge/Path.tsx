import type { SVGAttributes, WatchStopHandle } from "vue";
import type { MarkRequired } from "@/utils/UseType";
import type { EndpointType, EndpointPosition } from "@/components/MyGraphFlow";

export const enum PathType {
  Line = "line",
  Bezier = "bezier",
}

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
  id: string;
  type: PathType;
  position: PathPosition;
  attributes: SVGAttributes;
  pathDraw: (position: PathPosition) => string;
};

export type PartialPathOptions = MarkRequired<Partial<PathOptions>, "position">;

export class Path {
  id: string;
  options: PathOptions;
  stopWatchDrawPath?: WatchStopHandle;

  constructor(options: PartialPathOptions) {
    const { path: pathPreset } = useGraphFlowStore().preset;
    const { type = pathPreset.type } = options;
    defaultsDeep(options, pathPreset.map[type], { type });
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as PathOptions);

    const {
      position,
      attributes,
      attributes: { d },
      pathDraw,
    } = this.options;

    if (d === undefined) {
      if (position.type === undefined) position.type = PathPositionType.Right;
      this.stopWatchDrawPath = watchEffect(() => {
        attributes.d = pathDraw(position);
      });
    }
  }

  get attributes() {
    return this.options.attributes;
  }

  get position() {
    return this.options.position;
  }

  moveEndpoint({ x, y }: EndpointPosition, type: EndpointType) {
    this.options.position[`${type}X`] = x;
    this.options.position[`${type}Y`] = y;
  }

  endpointPosition(type: EndpointType) {
    return {
      x: this.position[`${type}X`],
      y: this.position[`${type}Y`],
    };
  }
}

export default defineComponent({
  props: {
    path: {
      type: Path,
      required: true,
    },
  },
  setup({ path }) {
    return () => (
      <g>
        <path {...path.attributes} />
      </g>
    );
  },
});
