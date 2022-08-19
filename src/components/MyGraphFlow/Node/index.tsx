import type { Ref, StyleValue, VNode } from "vue";
import type { Writable, ValueOf } from "@/utils/UseType";
import { type EventOptions, EventHandler } from "@/utils/UseEventHandler";
import { type Position, containerKey } from "@/components/MyGraphFlow";

export type NodeRect = Writable<DOMRect>;

type Data = {
  amount: number | string;
};

export type NodeOptions = {
  id?: string;
  showId?: boolean;
  position: Position;
  draggable?: boolean;
  label?: string | VNode;
  suffix?: keyof typeof suffixElement | VNode;
  suffixColor?: keyof typeof suffixColorMap;
  slot?: VNode;
  data?: Data;
};

const suffixElement = {
  arrowUp: <i-tabler-arrow-big-up-line class="inline" />,
  arrowDown: <i-tabler-arrow-big-downLine class="inline" />,
  chevronsUp: <i-bx-chevrons-up class="inline" />,
  chevronsDown: <i-bx-chevrons-down class="inline" />,
};
const suffixColorMap = {
  green: "text-green-600",
  orange: "text-orange-600",
  red: "text-red-600",
  blue: "text-blue-600",
  gray: "text-gray-600",
  yellow: "text-yellow-600",
};

type EventMapKey = object | string;
type MoveCallback = (position: Position, event: PointerEvent) => void;

type EventHandlerOptions = {
  move: { key: EventMapKey; options: EventOptions<MoveCallback> };
};

export class Node {
  id: string;
  showId?: boolean;
  position: Position;
  draggable: boolean;
  label: string | VNode;
  suffix?: VNode;
  suffixColor?: ValueOf<typeof suffixColorMap>;
  slot?: VNode;
  data?: Data;

  el?: Ref<HTMLElement | null> | HTMLElement;
  DOMRect = reactive({}) as NodeRect;
  eventHandler = new EventHandler<EventHandlerOptions>(["move"]);
  resizeObserver?: ResizeObserver;

  constructor(options: NodeOptions) {
    const { node: nodePreset } = useGraphFlowStore().preset;
    defaultsDeep(options, nodePreset);
    defaultNanoid(options);

    const {
      id,
      showId,
      position,
      draggable,
      label,
      suffix,
      suffixColor,
      slot,
      data,
    } = reactive(options);
    this.id = id!;
    this.showId = showId;
    this.position = position;
    this.draggable = draggable!;
    this.label = label!;
    this.slot = slot;
    this.data = data as Data;

    if (isString(suffix)) this.suffix = suffixElement[suffix];
    else this.suffix = suffix;

    if (suffixColor) this.suffixColor = suffixColorMap[suffixColor];
  }

  movePosition(position: Partial<Position>) {
    Object.assign(this.position, position);
  }

  get anchor(): StyleValue {
    const { x, y } = this.position;
    return `left: ${x}px; top: ${y}px`;
  }

  protected _observerResize() {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        const rect = resolveRect(entry.contentRect);
        Object.assign(this.DOMRect, rect);
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
    const omitId = node.id.replace(
      /(.{2})(.*)(.{2})/,
      node.id.length > 4 ? "$1..$3" : "$1$3"
    );

    const NodeElement = computed(() => (
      <section class="px-1 text-sm border border-slate-300 rounded-[2px] bg-gray-100 select-none opacity-80">
        {node.showId ? <sup>&lt;{omitId}&gt;</sup> : ""}
        <span>{node.label ?? label}</span>
        {node.suffix ? <span class={node.suffixColor}>{node.suffix}</span> : ""}
        {node.data?.amount ? <div>&lt;{node.data.amount}&gt;</div> : ""}
      </section>
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
