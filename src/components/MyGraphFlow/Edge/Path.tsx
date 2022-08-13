import type { SVGAttributes, WatchStopHandle } from "vue";
import type { Merge, MarkOptional, PickKeysByValue } from "@/utils/UseType";
import type { EndpointType, Position } from "@/components/MyGraphFlow";
import { type EventOptions, EventHandler } from "@/utils/UseEvent";

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
  sourceControl?: Position;
  targetControl?: Position;
  sourceOffset: Position;
  targetOffset: Position;
  curvature: number;
};
type PathPositionMoveType = Exclude<
  PickKeysByValue<PathPosition, Position>,
  undefined
>;

export type PathOptions = {
  id: string;
  type: PathType;
  positions: PathPosition;
  attributes: SVGAttributes;
  pathDraw: (position: PathPosition) => string;
};

type PartialPathPosition = {
  positions: MarkOptional<
    PathPosition,
    "type" | "sourceOffset" | "targetOffset" | "curvature"
  >;
};
export type PartialPathOptions = Merge<
  Partial<PathOptions>,
  PartialPathPosition
>;

type EventMapKey = object | string;
type MoveCallback = (position: Position, type: EndpointType) => void;
type unTraceEventOptions = EventOptions<() => void>;

type EventHandlerOptions = {
  move: { key: EventMapKey; options: EventOptions<MoveCallback> };
  unTraceMove: { key: EventMapKey; options: unTraceEventOptions };
  unTraceResize: { key: EventMapKey; options: unTraceEventOptions };
};

export class Path {
  id: string;
  options: PathOptions;
  eventHandler: EventHandler<EventHandlerOptions>;

  stopWatchDrawPath?: WatchStopHandle;

  constructor(options: PartialPathOptions) {
    this.eventHandler = new EventHandler([
      "move",
      "unTraceMove",
      "unTraceResize",
    ]);

    const { path: pathPreset } = useGraphFlowStore().preset;
    const { type = pathPreset.type } = options;
    defaultsDeep(
      options,
      pathPreset.map[type],
      { positions: cloneDeep(pathPreset.positions) },
      { type }
    );
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as PathOptions);

    const {
      positions,
      attributes,
      attributes: { d },
      pathDraw,
    } = this.options;

    if (d === undefined) {
      this.stopWatchDrawPath = watchEffect(() => {
        attributes.d = pathDraw(positions);
      });
    }
  }

  get attributes() {
    return this.options.attributes;
  }

  get positions() {
    return this.options.positions;
  }

  movePosition(position: Partial<Position>, type: PathPositionMoveType) {
    const currentPosition = this.positions[type];
    this.options.positions[type] = { ...currentPosition, ...position };
  }

  getPosition(type: PathPositionMoveType) {
    return this.positions[type];
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
