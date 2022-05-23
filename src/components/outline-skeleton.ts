import { alignRect, setAttributes, SVG_NS } from "../lib";
import { SkeletonShape } from "../types/skeleton-shape";

export class OutlineSkeleton implements SkeletonShape {
  private outer: SVGRectElement = document.createElementNS(SVG_NS, "rect");
  private inner: SVGRectElement = document.createElementNS(SVG_NS, "rect");

  constructor(private el: HTMLElement) {
    setAttributes(this.outer, { fill: "white" });
    setAttributes(this.inner, { fill: "black" });
  }

  getElements() {
    return [this.outer, this.inner];
  }

  sync() {
    const style = window.getComputedStyle(this.el);
    const { top, left, width, height } = this.el.getBoundingClientRect();
    const radius = parseFloat(style.borderRadius) || 0;
    const outlineWidth = parseFloat(style.borderWidth) || 1;

    alignRect(this.el, this.outer);

    setAttributes(this.outer, { rx: radius });
    setAttributes(this.inner, {
      width: width - outlineWidth * 2,
      height: height - outlineWidth * 2,
      rx: radius - outlineWidth,
      x: left + outlineWidth,
      y: top + outlineWidth,
    });
  }
}
