import type { SVGAttributes, WatchStopHandle } from "vue";
import { type EventOptions, EventHandler } from "@/utils/UseEventHandler";
import type { MarkOptional } from "@/utils/UseType";
import {
  type EndpointType,
  type Position,
  PositionType,
  mergeOffset,
} from "@/components/MyGraphFlow";

export const enum PathType {
  Line = "line",
  Curve = "curve",
  Step = "step",
}

export type PathPosition = {
  sourceType: PositionType;
  targetType: PositionType;
  source: Position;
  target: Position;
  sourceOffset: Position;
  targetOffset: Position;
  curvature: number;
  stepCornerSize: number;
};

type PartialPathPosition = MarkOptional<
  PathPosition,
  | "sourceType"
  | "targetType"
  | "sourceOffset"
  | "targetOffset"
  | "curvature"
  | "stepCornerSize"
>;

export type PathOptions = {
  id?: string;
  type?: PathType;
  positions: PartialPathPosition;
  attributes?: SVGAttributes;
  draw?: (position: PathPosition) => string;
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
  draw: (position: PathPosition) => string;

  eventHandler = new EventHandler<EventHandlerOptions>(["move"]);

  stopWatchDrawPath?: WatchStopHandle;

  constructor(options: PathOptions) {
    const { path: pathPreset } = useGraphFlowStore().preset;
    const { type = pathPreset.type } = options;

    defaultsDeep(options, pathPreset.cases[type], {
      type,
      positions: pathPreset.positions,
    });
    defaultNanoid(options);

    const { id, positions, attributes, draw } = reactive(options);
    this.id = id!;
    this.type = type;
    this.positions = positions as PathPosition;
    this.attributes = attributes!;
    this.draw = draw!;

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
        attributes!.d = draw(this.offsetPositions);
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
