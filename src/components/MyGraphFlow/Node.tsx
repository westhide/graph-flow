import type { Ref, StyleValue, VNode } from "vue";
import type { MarkOptional } from "@/utils/UseType";
import {
  type Path,
  type EndpointType,
  type Position,
  getPathOffset,
} from "@/components/MyGraphFlow";
import { type EventOptions, EventHandler } from "@/utils/UseEvent";

export type NodeOptions = {
  id: string;
  position: Position;
  draggable?: boolean;
  label?: string | VNode;
  slot?: VNode;
};

export type PartialNodeOptions = MarkOptional<NodeOptions, "id">;

type EventMapKey = object | string;
type MoveCallback = (position: Position, event: PointerEvent) => void;
type ResizeCallback = (rect: DOMRect) => void;

type EventHandlerOptions = {
  move: { key: EventMapKey; options: EventOptions<MoveCallback> };
  resize: { key: EventMapKey; options: EventOptions<ResizeCallback> };
};

export class Node {
  id: string;
  el?: Ref<HTMLElement | undefined> | HTMLElement;
  options: NodeOptions;
  eventHandler: EventHandler<EventHandlerOptions>;

  resizeObserver?: ResizeObserver;

  get position() {
    return this.options.position;
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  constructor(options: PartialNodeOptions) {
    this.eventHandler = new EventHandler(["move", "resize"]);

    const { node: nodePreset } = useGraphFlowStore().preset;
    defaultsDeep(options, nodePreset);
    defaultNanoid(options);

    this.id = options.id!;
    this.options = reactive(options as NodeOptions);
  }

  bindPathEndpointPosition(path: Path, type: EndpointType) {
    const unTraceCallback = this.eventHandler.set(
      "move",
      (position) => path.movePosition(position, type),
      path
    );
    path.eventHandler.set("unTraceMove", unTraceCallback, this);
  }

  bindPathOffset(path: Path, type: EndpointType) {
    const unTraceCallback = this.eventHandler.set(
      "resize",
      (rect) => {
        const {
          positions,
          positions: { type: positionType },
        } = path.options;

        positions[`${type}Offset`] = getPathOffset(rect, positionType, type);
      },
      path
    );
    path.eventHandler.set("unTraceResize", unTraceCallback, this);
  }

  protected _observerResize() {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) this.eventHandler.trigger("resize", entry.contentRect);
    });
    this.resizeObserver.observe(this.el as HTMLElement);
  }

  // TODO: fix useDraggable must el Ref<HTMLElement>
  protected _observerDrag(el: Ref<HTMLElement | undefined>) {
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

  mount(el: Ref<HTMLElement | undefined>) {
    this.el = el;
    if (this.options.draggable) this._observerDrag(el);

    onMounted(() => this._observerResize());
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

    const { label } = useGraphFlowStore().preset.node;

    const NodeElement = computed(() => (
      <div class="px-1 border border-slate-300 rounded-[2px] bg-gray-100 select-none">
        <span>{node.options.label ?? label}</span>
        <span class="text-xs">{`<${node.options.id}>`}</span>
      </div>
    ));

    return () => (
      <div
        ref={el}
        style={node.anchor}
        data-node-id={node.id}
        class="absolute cursor-grab shadow z-[1]"
      >
        {node.options.slot ?? NodeElement.value}
      </div>
    );
  },
});
