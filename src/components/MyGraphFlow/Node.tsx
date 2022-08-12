import type { Ref, StyleValue, VNode } from "vue";
import type { MarkOptional } from "@/utils/UseType";
import type { Path, EndpointType, Position } from "@/components/MyGraphFlow";
import { type EventOptions, EventHandler } from "@/utils/UseEvent";

export type NodeOptions = {
  id: string;
  position: Position;
  draggable?: boolean;
  label?: string | VNode;
  slot?: VNode;
};

export type PartialNodeOptions = MarkOptional<NodeOptions, "id">;

type MoveEventMapKey = object | string;
type MoveCallback = (position: Position, event: PointerEvent) => void;

type EventHandlerOptions = {
  move: { key: MoveEventMapKey; options: EventOptions<MoveCallback> };
};

export class Node {
  id: string;
  el?: Ref<HTMLElement | undefined>;
  options: NodeOptions;
  eventHandler: EventHandler<EventHandlerOptions>;

  get position() {
    return this.options.position;
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  constructor(options: PartialNodeOptions) {
    this.eventHandler = new EventHandler(["move"]);

    const { node: nodePreset } = useGraphFlowStore().preset;
    defaultsDeep(options, nodePreset);
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as NodeOptions);
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
    if (!this.options.draggable) return;

    const onMove: MoveCallback = (...arg) =>
      this.eventHandler.trigger("move", ...arg);

    useDraggable(el, {
      initialValue: this.position,
      onMove: onMove.bind(this),
    });

    this.el = el;
    this.eventHandler.set(
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
    const { label } = useGraphFlowStore().preset.node;
    node.mount(el);

    const NodeElement = computed(() => (
      <div class="px-1 -translate-y-1/2 -translate-x-1/2 border border-slate-300 rounded-[2px] bg-gray-100 select-none">
        <span>{node.options.label ?? label}</span>
        <span class="text-xs">{`<${node.options.id}>`}</span>
      </div>
    ));

    return () => (
      <div
        ref={el}
        style={node.anchor}
        class="absolute cursor-grab focus:cursor-grabbing z-[2]"
      >
        {node.options.slot ?? NodeElement.value}
      </div>
    );
  },
});
