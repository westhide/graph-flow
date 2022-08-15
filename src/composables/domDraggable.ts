import { Ref } from "vue";

type Position = {
  x: number;
  y: number;
};

type Options = {
  container?: Ref<HTMLElement | null>;
  initPosition?: Position;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

function getElementRect(el?: HTMLElement | null) {
  const rect = el?.getBoundingClientRect();
  if (rect) return { x: rect.x, y: rect.y };
  else return { x: 0, y: 0 };
}

export function domDraggable(
  el: Ref<HTMLElement | null>,
  options: Options = {}
) {
  const { container, initPosition } = options;

  const target = unref(el);
  const root = unref(container);
  let position = $ref<Position>(initPosition);
  let offset = $ref<Position | undefined>();

  const start = (e: PointerEvent) => {
    const rootRect = getElementRect(root);
    const targetRect = getElementRect(target);
    offset = {
      x: e.pageX - targetRect.x + rootRect.x,
      y: e.pageY - targetRect.y + rootRect.y,
    };
  };

  const move = (e: PointerEvent) => {
    if (!offset) return;
    position = {
      x: e.pageX - offset.x,
      y: e.pageY - offset.y,
    };
  };

  const end = (_e: PointerEvent) => {
    if (!offset) return;
    offset = undefined;
  };

  useEventListener(target, "pointerdown", start, true);
  useEventListener(window, "pointermove", move, true);
  useEventListener(window, "pointerup", end, true);

  return $$({ position });
}
