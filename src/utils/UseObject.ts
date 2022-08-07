export { defaultsDeep } from "lodash-es";

export function objectKeys<T extends Record<string | number, unknown>>(
  object: T
) {
  return <Array<keyof T>>Object.keys(object);
}
