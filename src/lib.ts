export const SVG_NS = "http://www.w3.org/2000/svg" as const;

export const setAttributes = (
  el: Element,
  attrs: { [x: string]: string | number }
) => {
  for (const attr in attrs) {
    el.setAttribute(
      attr,
      typeof attrs[attr] === "string"
        ? (attrs[attr] as string)
        : attrs[attr].toString()
    );
  }
};

export const alignRect = (a: Element, b: Element) => {
  const { width, height, top, left } = a.getBoundingClientRect();
  setAttributes(b, {
    width: width.toString(),
    height: height.toString(),
    y: top.toString(),
    x: left.toString(),
  });
};

export class Identity {
  private static id = 0;
  static next() {
    return this.id++;
  }
}
