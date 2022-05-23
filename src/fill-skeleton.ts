import { alignRect, setAttributes, SVG_NS } from "./lib";
import { SkeletonShape } from "./types/skeleton-shape";

export class FillSkeleton implements SkeletonShape {
  private rect: SVGRectElement = document.createElementNS(SVG_NS, "rect");

  constructor(private el: HTMLElement) {
    this.rect.setAttribute("fill", "white");
  }

  sync() {
    const { borderRadius } = window.getComputedStyle(this.el);
    alignRect(this.el, this.rect);
    setAttributes(this.rect, { rx: borderRadius, fill: "white" });
  }

  getElements() {
    return [this.rect];
  }
}
