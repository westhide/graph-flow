import type { UserConfig } from "@commitlint/types";

export default <UserConfig>{
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  rules: {
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "prune",
        "refactor",
        "release",
        "revert",
        "style",
        "test",
        "wip",
      ],
    ],
  },
};
