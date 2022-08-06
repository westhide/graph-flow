export function executeTime(fn: () => unknown) {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
}
