import { KeyOfMap, ValueOfMap, ValueOf, AnyFunction } from "@/utils/UseType";

export type EventOptions<F extends AnyFunction = AnyFunction> = {
  callback: F;
};

class Event<O extends EventOptions> {
  options: O;
  get callback() {
    return this.options.callback;
  }

  constructor(options: O) {
    this.options = options;
  }

  execute(...arg: Parameters<typeof this.callback>) {
    this.callback(...arg);
  }
}

type OptionsItem = { key: unknown; options: EventOptions };
type Options = Record<string, OptionsItem>;

type EventMaps<O extends Options> = O extends Record<infer K, OptionsItem>
  ? Record<K, Map<O[K]["key"], Event<O[K]["options"]>>>
  : never;

export class EventHandler<O extends Options> {
  events: EventMaps<O>;

  constructor(eventTypes: (keyof EventMaps<O>)[]) {
    const events = {} as EventMaps<O>;
    for (const type of eventTypes) {
      events[type] = new Map() as ValueOf<EventMaps<O>>;
    }
    this.events = events;
  }

  set(
    type: keyof EventMaps<O>,
    optionsOrCallback:
      | ValueOfMap<EventMaps<O>[typeof type]>["options"]
      | ValueOfMap<EventMaps<O>[typeof type]>["options"]["callback"],
    key: KeyOfMap<EventMaps<O>[typeof type]>
  ) {
    if (isFunction(optionsOrCallback))
      optionsOrCallback = { callback: optionsOrCallback };

    this.events[type]!.set(key, new Event(optionsOrCallback));
    return () => this.delete(type, key);
  }

  get(type: keyof EventMaps<O>, key: KeyOfMap<EventMaps<O>[typeof type]>) {
    return this.events[type]!.get(key);
  }

  delete(type: keyof EventMaps<O>, key: KeyOfMap<EventMaps<O>[typeof type]>) {
    return this.events[type]!.delete(key);
  }

  execute(
    type: keyof EventMaps<O>,
    key: KeyOfMap<EventMaps<O>[typeof type]>,
    ...arg: Parameters<ValueOfMap<EventMaps<O>[typeof type]>["callback"]>
  ) {
    this.get(type, key)?.execute(...arg);
  }

  trigger(
    type: keyof EventMaps<O>,
    ...arg: Parameters<ValueOfMap<EventMaps<O>[typeof type]>["callback"]>
  ) {
    for (const event of this.events[type]!.values()) event.execute(...arg);
  }
}
