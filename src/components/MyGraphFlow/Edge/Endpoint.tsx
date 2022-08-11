import type { Ref, StyleValue, VNode } from "vue";
import { EventMap } from "@/utils/UseEvent";
import { ValueOfMap, MarkOptional } from "@/utils/UseType";

export type EndpointType = "source" | "target";
export type EndpointPosition = {
  x: number;
  y: number;
};
export type EndpointMoveEvent = (
  position: EndpointPosition,
  event: PointerEvent
) => void;

export type EndpointOptions = {
  id: string;
  position: EndpointPosition;
  draggable?: boolean;
  slot?: VNode;
};

export type PartialEndpointOptions = MarkOptional<EndpointOptions, "id">;

export type EndpointEvents = {
  move: EventMap<EndpointMoveEvent>;
};

export class Endpoint {
  id: string;
  el?: Ref<HTMLElement | undefined>;
  options: EndpointOptions;
  events: EndpointEvents = {
    move: new EventMap<EndpointMoveEvent>(),
  };

  get position() {
    return this.options.position;
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  constructor(options: PartialEndpointOptions) {
    const { endpoint: endpointPreset } = useGraphFlowStore().preset;
    defaultsDeep(options, endpointPreset);
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as EndpointOptions);
  }

  triggerEvents(
    type: keyof EndpointEvents,
    ...arg: Parameters<ValueOfMap<EndpointEvents[typeof type]["eventMap"]>>
  ) {
    this.events[type].triggerAll(...arg);
  }

  setEvent(type: keyof EndpointEvents, event: EndpointMoveEvent, key?: string) {
    return this.events[type].set(key, event);
  }

  deleteEvent(type: keyof EndpointEvents, key: string) {
    return this.events[type].delete(key);
  }

  mount(el: Ref<HTMLElement | undefined>) {
    if (!this.options.draggable) return;

    const onMove: EndpointMoveEvent = (...arg) =>
      this.triggerEvents("move", ...arg);

    useDraggable(el, {
      initialValue: this.position,
      onMove: onMove.bind(this),
    });

    this.el = el;
    this.setEvent(
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
        class="absolute cursor-pointer z-[1]"
      >
        {endpoint.options.slot ?? EndpointSpot}
      </div>
    );
  },
});
