import { nanoid } from "nanoid";

export { nanoid } from "nanoid";

export function defaultNanoid<T extends Partial<Record<"id", string>>>(
  target: T,
  size = 10
) {
  if (target.id === undefined) target.id = nanoid(size);
}
