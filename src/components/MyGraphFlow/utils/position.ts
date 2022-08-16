import {
  type Position,
  type EndpointType,
  PathPositionType,
} from "@/components/MyGraphFlow";

export function mergeOffset({ x, y }: Position, offset: Position) {
  return { x: x + offset.x, y: y + offset.y };
}

/** calculate path offset with different PathPositionType */
export function getEndpointOffset(
  rect: DOMRect,
  positionType: PathPositionType,
  endpointType: EndpointType
) {
  const { width = 0, height = 0 } = rect;
  let x = 0,
    y = 0;
  switch (positionType) {
    case PathPositionType.Left:
      y = height / 2;
      if (endpointType === "target") x = width;
      break;
    case PathPositionType.Right:
      y = height / 2;
      if (endpointType === "source") x = width;
      break;
    case PathPositionType.Top:
      x = width / 2;
      if (endpointType === "target") y = height;
      break;
    case PathPositionType.Bottom:
      x = width / 2;
      if (endpointType === "source") y = height;
      break;
    case PathPositionType.Float:
      break;
    default:
      throw new Error(`PathPositionType: "${positionType}" undefined`);
  }
  return { x, y } as Position;
}
