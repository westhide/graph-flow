import type { Ref, StyleValue, VNode } from "vue";
import { EventMap } from "@/utils/UseEvent";
import { ValueOfMap, MarkOptional } from "@/utils/UseType";

export type NodePosition = {
  x: number;
  y: number;
};
export type NodeMoveEvent = (
  position: NodePosition,
  event: PointerEvent
) => void;

export type NodeOptions = {
  id: string;
  position: NodePosition;
  draggable?: boolean;
  label?: string | VNode;
  slot?: VNode;
};

export type PartialNodeOptions = MarkOptional<NodeOptions, "id">;

export type NodeEvents = {
  move: EventMap<NodeMoveEvent>;
};

export class Node {
  id: string;
  el?: Ref<HTMLElement | undefined>;
  options: NodeOptions;
  events: NodeEvents = {
    move: new EventMap<NodeMoveEvent>(),
  };

  get position() {
    return this.options.position;
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  constructor(options: PartialNodeOptions) {
    const { node: nodePreset } = useGraphFlowStore().preset;
    defaultsDeep(options, nodePreset);
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as NodeOptions);
  }

  triggerEvents(
    type: keyof NodeEvents,
    ...arg: Parameters<ValueOfMap<NodeEvents[typeof type]["eventMap"]>>
  ) {
    this.events[type].triggerAll(...arg);
  }

  setEvent(type: keyof NodeEvents, event: NodeMoveEvent, key?: string) {
    return this.events[type].set(key, event);
  }

  deleteEvent(type: keyof NodeEvents, key: string) {
    return this.events[type].delete(key);
  }

  mount(el: Ref<HTMLElement | undefined>) {
    if (!this.options.draggable) return;

    const onMove: NodeMoveEvent = (...arg) =>
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
    node: {
      type: Node,
      required: true,
    },
  },
  setup({ node }) {
    const el = ref<HTMLElement>();

    node.mount(el);

    const NodeElement = (
      <div class="px-1 -translate-y-1/2 -translate-x-1/2 border border-slate-300 rounded-[2px] bg-gray-100 select-none">
        <span>{node.options.label}</span>
        <span class="text-xs">{`<${node.options.id}>`}</span>
      </div>
    );

    return () => (
      <div
        ref={el}
        style={node.anchor}
        class="absolute cursor-grab focus:cursor-grabbing z-[2]"
      >
        {node.options.slot ?? NodeElement}
      </div>
    );
  },
});
