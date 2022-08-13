import { KeyOfMap, AnyFunction } from "@/utils/UseType";

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

  execute(...arg: Parameters<O["callback"]>) {
    this.callback(...arg);
  }
}

type OptionsItem = { key: unknown; options: EventOptions };
type Options = Record<string, OptionsItem>;

type EventMaps<O extends Options> = {
  [K in keyof O]: Map<O[K]["key"], Event<O[K]["options"]>>;
};

export class EventHandler<O extends Options> {
  events: EventMaps<O>;

  constructor(eventTypes: Array<keyof O>) {
    const events = {} as EventMaps<O>;
    for (const type of eventTypes) {
      events[type] = new Map();
    }
    this.events = events;
  }

  set<T extends keyof O>(
    type: T,
    optionsOrCallback: O[T]["options"] | O[T]["options"]["callback"],
    key: KeyOfMap<EventMaps<O>[T]>
  ) {
    if (isFunction(optionsOrCallback))
      optionsOrCallback = { callback: optionsOrCallback };

    this.events[type]!.set(key, new Event(optionsOrCallback));
    return () => this.delete(type, key);
  }

  get<T extends keyof O>(type: T, key: KeyOfMap<EventMaps<O>[T]>) {
    return this.events[type]!.get(key);
  }

  delete<T extends keyof O>(type: T, key: KeyOfMap<EventMaps<O>[T]>) {
    return this.events[type]!.delete(key);
  }

  execute<T extends keyof O>(
    type: T,
    key: KeyOfMap<EventMaps<O>[T]>,
    ...arg: Parameters<O[T]["options"]["callback"]>
  ) {
    this.get(type, key)?.execute(...arg);
  }

  trigger<T extends keyof O>(
    type: T,
    ...arg: Parameters<O[T]["options"]["callback"]>
  ) {
    for (const event of this.events[type]!.values()) event.execute(...arg);
  }
}
