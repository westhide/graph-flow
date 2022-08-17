import { type Position, PositionType } from "@/components/MyGraphFlow";

export function mergeOffset({ x, y }: Position, offset: Position) {
  return { x: x + offset.x, y: y + offset.y };
}

/** calculate path offset with different PathPositionType */
export function getEndpointOffset(rect: DOMRect, positionType: PositionType) {
  const { width = 0, height = 0 } = rect;
  let x = 0,
    y = 0;
  switch (positionType) {
    case PositionType.Left:
      y = height / 2;
      break;
    case PositionType.Right:
      y = height / 2;
      x = width;
      break;
    case PositionType.Top:
      x = width / 2;
      break;
    case PositionType.Bottom:
      x = width / 2;
      y = height;
      break;
    case PositionType.Float:
      break;
    default:
      throw new Error(`PathPositionType: "${positionType}" undefined`);
  }
  return { x, y } as Position;
}

export function getPositionCenter(source: Position, target: Position) {
  return { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 };
}

export function getPositionDistance(source: Position, target: Position) {
  return { x: target.x - source.x, y: target.y - source.y };
}
