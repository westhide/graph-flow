import { AnyFunction } from "@/utils/UseType";

type EventMapKey = string | symbol;

export class EventMap<F extends AnyFunction> {
  eventMap = new Map<EventMapKey, F>();

  set(key: EventMapKey = nanoid(), value: F) {
    this.eventMap.set(key, value);
    return key;
  }

  get(key: EventMapKey) {
    return this.eventMap.get(key);
  }

  delete(key: EventMapKey) {
    return this.eventMap.delete(key);
  }

  trigger(key: EventMapKey, ...arg: Parameters<F>) {
    this.eventMap.get(key)?.(...arg);
  }

  triggerAll(...arg: Parameters<F>) {
    for (const fn of this.eventMap.values()) fn(...arg);
  }
}

export function triggerEvents<T extends AnyFunction>(
  events: T[],
  ...arg: Parameters<T>
) {
  for (const fn of events) fn(...arg);
}
