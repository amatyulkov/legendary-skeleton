import { Skeleton } from "./skeleton";

const getStops = (s: Skeleton) =>
  Array.from(s.getElement().querySelectorAll("stop"));

describe("Skeleton", () => {
  it("Should accept gradient stops", () => {
    expect(() => new Skeleton()).not.toThrow();
  });

  it("Should have default gradient stops", () => {
    const skeleton = new Skeleton();

    expect(getStops(skeleton)).toMatchSnapshot("default stops");
  });

  it("Should allow to overwrite stops", () => {
    const skeleton = new Skeleton();

    expect(getStops(skeleton)).toMatchSnapshot("default stops");

    skeleton.setConfig({
      stops: [
        { offset: 0, color: "red" },
        { offset: 0.1, color: "green" },
        { offset: 0.2, color: "blue" },
        { offset: 0.3, color: "white" },
      ],
    });

    expect(getStops(skeleton)).toMatchSnapshot("updated stops");
  });
});
