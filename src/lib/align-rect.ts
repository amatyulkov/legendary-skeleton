import { setAttributes } from "./set-attributes";

export const alignRect = (a: Element, b: Element) => {
  const { width, height, top, left } = a.getBoundingClientRect();
  setAttributes(b, {
    width: width.toString(),
    height: height.toString(),
    y: top.toString(),
    x: left.toString(),
  });
};
