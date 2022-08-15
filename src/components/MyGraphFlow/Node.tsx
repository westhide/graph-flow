import type { Ref, StyleValue, VNode } from "vue";
import type { Writable } from "@/utils/UseType";
import { type EventOptions, EventHandler } from "@/utils/UseEventHandler";
import { type Position, containerKey } from "@/components/MyGraphFlow";

export type NodeRect = Writable<DOMRect>;

export type NodeOptions = {
  id?: string;
  position: Position;
  offset?: Position;
  draggable?: boolean;
  label?: string | VNode;
  slot?: VNode;
};

type EventMapKey = object | string;
type MoveCallback = (position: Position, event: PointerEvent) => void;

type EventHandlerOptions = {
  move: { key: EventMapKey; options: EventOptions<MoveCallback> };
};

export class Node {
  id: string;
  position: Position;
  draggable: boolean;
  label: string | VNode;
  slot?: VNode;

  el?: Ref<HTMLElement | null> | HTMLElement;
  domRect = reactive({}) as NodeRect;
  eventHandler = new EventHandler<EventHandlerOptions>(["move"]);
  resizeObserver?: ResizeObserver;

  constructor(options: NodeOptions) {
    const { node: nodePreset } = useGraphFlowStore().preset;
    defaultsDeep(options, cloneDeep(nodePreset));
    defaultNanoid(options);

    const { id, position, draggable, label, slot } = reactive(options);
    this.id = id!;
    this.position = position;
    this.draggable = draggable!;
    this.label = label!;
    this.slot = slot;
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  protected _observerResize() {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        const rect = resolveRect(entry.contentRect);
        Object.assign(this.domRect, rect);
      }
    });
    this.resizeObserver.observe(this.el as HTMLElement);
  }

  // TODO: fix useDraggable must el Ref<HTMLElement>
  protected _observerDrag(el: Ref<HTMLElement | null>) {
    const container = inject(containerKey);

    const { position } = domDraggable(el, {
      initPosition: this.position,
      container,
    });

    watchEffect(() => {
      Object.assign(this.position, position.value);
    });
  }

  movePosition(position: Partial<Position>) {
    Object.assign(this.position, position);
  }

  mount(el: Ref<HTMLElement | null>) {
    this.el = el;

    onMounted(() => {
      if (this.draggable) this._observerDrag(el);
      this._observerResize();
    });
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
    const el = ref<HTMLElement | null>(null);

    node.mount(el);

    const { label } = useGraphFlowStore().preset.node;

    const NodeElement = computed(() => (
      <div class="px-1 border border-slate-300 rounded-[2px] bg-gray-100 select-none">
        <span>{node.label ?? label}</span>
        <span class="text-xs">{`<${node.id}>`}</span>
      </div>
    ));

    return () => (
      <div
        ref={el}
        style={node.anchor}
        data-node-id={node.id}
        class="absolute cursor-grab shadow z-[1]"
      >
        {node.slot ?? NodeElement.value}
      </div>
    );
  },
});
