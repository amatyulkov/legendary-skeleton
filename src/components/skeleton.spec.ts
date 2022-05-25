import { Skeleton } from "./skeleton";

const getStops = (s: Skeleton) =>
  Array.from(s.getElement().querySelectorAll("stop"));

const setBodyScrollDimensions = (w: number, h: number) => {
  const a = jest
    .spyOn(document.body, "scrollWidth", "get")
    .mockImplementation(() => w);

  const b = jest
    .spyOn(document.body, "scrollHeight", "get")
    .mockImplementation(() => h);

  return () => {
    a.mockRestore();
    b.mockRestore();
  };
};

const setRects = (
  el: HTMLElement,
  rect: Pick<DOMRect, "top" | "left" | "width" | "height">
) =>
  jest
    .spyOn(el, "getBoundingClientRect")
    .mockImplementation(() => rect as DOMRect);

describe("Skeleton", () => {
  beforeEach(() => {
    Array.from(document.body.children).forEach((x) => x.remove());
  });
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

  it("should update parts coordinates on resize", () => {
    const part = document.createElement("div");
    part.setAttribute("data-skeleton", "fill");

    document.body.appendChild(part);
    setBodyScrollDimensions(500, 500);
    const oldSize = setRects(part, {
      top: 125,
      left: 125,
      width: 250,
      height: 250,
    });

    const skeleton = new Skeleton();
    const el = skeleton.getElement();
    const partSvg = el.querySelector("mask rect");

    expect(el.getAttribute("viewbox")).toBe("0 0 500 500");
    expect(partSvg).toMatchSnapshot();

    oldSize.mockRestore();

    setBodyScrollDimensions(400, 400);

    const newSize = setRects(part, {
      top: 100,
      left: 100,
      width: 200,
      height: 200,
    });

    global.dispatchEvent(new Event("resize"));

    expect(el.getAttribute("viewbox")).toBe("0 0 400 400");
    expect(partSvg).toMatchSnapshot();
    newSize.mockRestore();
  });

  it("should throttle resize calls", () => {
    const skeleton = new Skeleton();

    // override visibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = jest.spyOn(skeleton as any, "onResize");

    expect(spy.mock.calls).toHaveLength(0);

    Array.from({ length: 5 }).forEach(() => {
      global.dispatchEvent(new Event("resize"));
    });

    expect(spy.mock.calls).toHaveLength(1);
  });
});
