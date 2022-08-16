import type { SVGAttributes, WatchStopHandle } from "vue";
import { type EventOptions, EventHandler } from "@/utils/UseEventHandler";
import type { MarkOptional } from "@/utils/UseType";
import {
  type EndpointType,
  type Position,
  mergeOffset,
} from "@/components/MyGraphFlow";

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
  type: PathPositionType;
  source: Position;
  target: Position;
  sourceOffset: Position;
  targetOffset: Position;
};

type PartialPathPosition = MarkOptional<
  PathPosition,
  "type" | "sourceOffset" | "targetOffset"
>;

export type PathOptions = {
  id?: string;
  type?: PathType;
  positions: PartialPathPosition;
  attributes?: SVGAttributes;
  draw?: (position: PathPosition, curvature: number) => string;
  curvature?: number;
};

type EventMapKey = object | string;
type MoveCallback = (position: Position, type: EndpointType) => void;

type EventHandlerOptions = {
  move: { key: EventMapKey; options: EventOptions<MoveCallback> };
};

export class Path {
  id: string;
  type: PathType;
  positions: PathPosition;
  attributes: SVGAttributes;
  draw: (position: PathPosition, curvature: number) => string;
  curvature: number;

  eventHandler = new EventHandler<EventHandlerOptions>(["move"]);

  stopWatchDrawPath?: WatchStopHandle;

  constructor(options: PathOptions) {
    const { path: pathPreset } = useGraphFlowStore().preset;
    const { type = pathPreset.type } = options;

    defaultsDeep(options, pathPreset.cases[type], {
      type,
      positions: pathPreset.positions,
      curvature: pathPreset.curvature,
    });
    defaultNanoid(options);

    const { id, positions, attributes, draw, curvature } = reactive(options);
    this.id = id!;
    this.type = type;
    this.positions = positions as PathPosition;
    this.attributes = attributes!;
    this.draw = draw!;
    this.curvature = curvature!;

    this._watchPathDraw();
  }

  protected _watchPathDraw() {
    const {
      attributes,
      attributes: { d },
      draw,
    } = this;

    if (d === undefined) {
      this.stopWatchDrawPath = watchEffect(() => {
        attributes!.d = draw(this.offsetPositions, this.curvature);
      });
    }
  }

  movePosition(position: Partial<Position>, type: EndpointType) {
    Object.assign(this.positions[type], position);
  }

  getPosition(type: EndpointType) {
    return this.positions[type];
  }

  get offsetPositions() {
    const { source, sourceOffset, target, targetOffset } = this.positions;
    return {
      ...this.positions,
      source: mergeOffset(source, sourceOffset),
      target: mergeOffset(target, targetOffset),
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
        <path {...path.attributes} data-path-id={path.id} />
      </g>
    );
  },
});
