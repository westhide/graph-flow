import type { Ref, StyleValue, VNode } from "vue";
import type { MarkOptional } from "@/utils/UseType";
import type { Path, Position } from "@/components/MyGraphFlow";
import { type EventOptions, EventHandler } from "@/utils/UseEvent";

export type EndpointType = "source" | "target";

export type EndpointOptions = {
  id: string;
  position: Position;
  draggable?: boolean;
  slot?: VNode;
};

export type PartialEndpointOptions = MarkOptional<EndpointOptions, "id">;

type MoveEventMapKey = object | string;
type MoveCallback = (position: Position, event: PointerEvent) => void;

type EventHandlerOptions = {
  move: { key: MoveEventMapKey; options: EventOptions<MoveCallback> };
};

export class Endpoint {
  id: string;
  el?: Ref<HTMLElement | undefined> | HTMLElement;
  options: EndpointOptions;
  eventHandler: EventHandler<EventHandlerOptions>;

  get position() {
    return this.options.position;
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  constructor(options: PartialEndpointOptions) {
    this.eventHandler = new EventHandler(["move"]);

    const { endpoint: endpointPreset } = useGraphFlowStore().preset;
    defaultsDeep(options, endpointPreset);
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as EndpointOptions);
  }

  bindPathMoveEvent(path: Path, type: EndpointType) {
    const unTraceCallback = this.eventHandler.set(
      "move",
      (position) => path.moveEndpoint(position, type),
      path
    );
    path.eventHandler.set("unTraceMove", unTraceCallback, this);
  }

  mount(el: Ref<HTMLElement | undefined>) {
    this.el = el;

    if (!this.options.draggable) return;

    const onMove: MoveCallback = (...arg) =>
      this.eventHandler.trigger("move", ...arg);

    useDraggable(el, {
      initialValue: this.position,
      onMove: onMove.bind(this),
    });

    this.eventHandler.set(
      "move",
      (position) => (this.options.position = position),
      "default"
    );
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
    const el = ref<HTMLElement>();

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
        {endpoint.options.slot ?? EndpointSpot}
      </div>
    );
  },
});
