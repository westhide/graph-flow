// ts-node [filePath]
import { suite, add, cycle, complete, save } from "benny";

module.exports = suite(
  "Benchmark Setup",

  add("reduce two elements", () => {
    [1, 2].reduce((a, b) => a + b);
  }),

  cycle(),
  complete(),
  save({ file: "setup", version: "0.1.0" }),
  save({ file: "setup", format: "chart.html" })
);
