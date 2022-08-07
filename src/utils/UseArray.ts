export function arrayReplace<T>(target: T[], entries: [T, T][]): void;
export function arrayReplace<T>(target: T[], fromValue: T, toValue: T): void;
export function arrayReplace<T>(target: T[], replace: unknown, toValue?: T) {
  target.forEach((value, index) => {
    if (isArray<[T, T]>(replace)) {
      replace.forEach(([from, to]) => {
        if (value === from) {
          target[index] = to;
        }
      });
      return;
    }

    if (replace === target[index]) {
      target[index] = toValue!;
    }
  });
}

function _arrayPut<T>(target: T[], value: T, replace?: T) {
  if (target.includes(value)) return;

  if (replace !== undefined && target.includes(replace)) {
    arrayReplace(target, replace, value);
  } else {
    target.push(value);
  }
}
export function arrayPut<T>(target: T[], value: T, replace?: T): void;
export function arrayPut<T>(target: T[], values: T[]): void;
export function arrayPut<T>(target: T[], replaces: [T, T][]): void;
export function arrayPut<T>(target: T[], values: unknown, replace?: T) {
  if (isArray(values)) {
    values.forEach((item) => {
      isArray<[T, T]>(item)
        ? item.forEach(([value, replace]) => _arrayPut(target, value, replace))
        : _arrayPut(target, item);
    });
  } else {
    _arrayPut(target, values, replace);
  }
}

type FilterFn<T> = (value: T, index: number, array: T[]) => boolean;
export function reduceFilter<T>(target: T[], fns?: FilterFn<T>[]) {
  return fns ? fns.reduce((rows, fn) => rows.filter(fn), target) : target;
}
