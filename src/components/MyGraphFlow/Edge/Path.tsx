import type { SVGAttributes, WatchStopHandle } from "vue";
import { type EventOptions, EventHandler } from "@/utils/UseEventHandler";
import type { MarkOptional } from "@/utils/UseType";
import {
  type NodeRect,
  type EndpointType,
  type Position,
  getEndpointOffset,
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
  sourceControl?: Position;
  targetControl?: Position;
  sourceRect: NodeRect;
  targetRect: NodeRect;
  curvature: number;
};

type PartialPathPosition = MarkOptional<
  PathPosition,
  "type" | "sourceRect" | "targetRect" | "curvature"
>;

export type PathOptions = {
  id?: string;
  type?: PathType;
  positions: PartialPathPosition;
  attributes?: SVGAttributes;
  pathDraw?: (position: PathPosition) => string;
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
  pathDraw: (position: PathPosition) => string;

  eventHandler = new EventHandler<EventHandlerOptions>(["move"]);

  stopWatchDrawPath?: WatchStopHandle;

  constructor(options: PathOptions) {
    const { path: pathPreset } = useGraphFlowStore().preset;
    const { type = pathPreset.type } = options;

    defaultsDeep(
      options,
      pathPreset.map[type],
      { positions: cloneDeep(pathPreset.positions) },
      { type }
    );
    defaultNanoid(options);

    const { id, positions, attributes, pathDraw } = reactive(options);
    this.id = id!;
    this.type = type;
    this.positions = positions as PathPosition;
    this.attributes = attributes!;
    this.pathDraw = pathDraw!;

    this._watchPathDraw();
  }

  protected _watchPathDraw() {
    const {
      attributes,
      attributes: { d },
      pathDraw,
    } = this;

    if (d === undefined) {
      this.stopWatchDrawPath = watchEffect(() => {
        attributes!.d = pathDraw(this.offsetPositions);
      });
    }
  }

  movePosition(position: Partial<Position>, type: EndpointType) {
    Object.assign(this.positions[type], position);
  }

  getPosition(type: EndpointType) {
    return this.positions[type];
  }

  protected _mergeOffset({ x, y }: Position, offset: Position) {
    return { x: x + offset.x, y: y + offset.y };
  }

  get offsetPositions() {
    const { type, source, sourceRect, target, targetRect } = this.positions;
    const sourceOffset = getEndpointOffset(sourceRect, type, "source");
    const targetOffset = getEndpointOffset(targetRect, type, "target");
    return {
      ...this.positions,
      source: this._mergeOffset(source, sourceOffset),
      target: this._mergeOffset(target, targetOffset),
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
