export { cloneDeep } from "lodash-es";

import type { DeepPartial } from "@/utils/UseType";
import { defaultsDeep as _defaultsDeep } from "lodash-es";

export function objectKeys<T extends Record<string | number, unknown>>(
  object: T
) {
  return <Array<keyof T>>Object.keys(object);
}

export function defaultsDeep<T extends object>(
  target: T,
  ...sources: DeepPartial<T>[]
) {
  _defaultsDeep(target, ...sources);
  return target;
}
