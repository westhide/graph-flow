import type { Ref, StyleValue } from "vue";
import { type EventOptions, EventHandler } from "@/utils/UseEventHandler";
import {
  type NodeRect,
  type Position,
  type PathPositionType,
  type NodeOptions,
  getEndpointOffset,
  Node,
} from "@/components/MyGraphFlow";

export type EndpointType = "source" | "target";

export type EndpointOptions = NodeOptions & {
  type: EndpointType;
  positionType?: PathPositionType;
  nodeRect?: NodeRect;
};

type EventMapKey = object | string;
type MoveCallback = (position: Position, event: PointerEvent) => void;

type EventHandlerOptions = {
  move: { key: EventMapKey; options: EventOptions<MoveCallback> };
};

export class Endpoint extends Node {
  type: EndpointType;
  positionType: PathPositionType;
  nodeRect: NodeRect;

  override eventHandler = new EventHandler<EventHandlerOptions>(["move"]);

  constructor(options: EndpointOptions) {
    const {
      endpoint: endpointPreset,
      path: {
        positions: { type: pathPositionType },
      },
    } = useGraphFlowStore().preset;
    defaultsDeep(options, endpointPreset);
    defaultNanoid(options);

    super(options);

    const { type, positionType = pathPositionType, nodeRect } = options;
    this.nodeRect = nodeRect!;
    this.type = type;
    this.positionType = positionType;
  }

  override get anchor(): StyleValue {
    const { x, y } = this._mergeOffset(this.position, this.offset);
    return `left: ${x}px; top: ${y}px`;
  }

  protected _mergeOffset({ x, y }: Position, offset: Position) {
    return { x: x + offset.x, y: y + offset.y };
  }

  get offset() {
    return getEndpointOffset(this.nodeRect, this.positionType, this.type);
  }

  override mount(el: Ref<HTMLElement | null>) {
    this.el = el;
  }
}

export default defineComponent({
  props: {
    endpoint: {
      type: Endpoint,
      required: true,
    },
  },
  setup({ endpoint }) {
    const el = ref<HTMLElement | null>(null);

    endpoint.mount(el);

    const EndpointSpot = (
      <span class="absolute w-3 h-3 -translate-y-1/2 -translate-x-1/2 border-2 rounded-circle border-slate-400 bg-white shadow-inner shadow-blue-400 select-none" />
    );

    return () => (
      <div
        ref={el}
        style={endpoint.anchor}
        data-endpoint-id={endpoint.id}
        class="absolute cursor-pointer z-[2]"
      >
        {endpoint.slot ?? EndpointSpot}
      </div>
    );
  },
});
