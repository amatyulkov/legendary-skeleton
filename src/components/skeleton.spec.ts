import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("Should accept gradient stops", () => {
    expect(() => new Skeleton()).not.toThrow();
  });
});
