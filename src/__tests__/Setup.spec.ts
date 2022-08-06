export {};

describe("setup vitest", () => {
  it("setup", () => {
    expect(1 + 1).toEqual(2);
    console.log("vitest setup");
  });

  it("snapshot", () => {
    expect("test snapshot").toMatchSnapshot();
  });
});
