import { Identity, setAttributes, SVG_NS } from "../lib";
import { SkeletonConfig } from "../types/skeleton-config";

export class SkeletonGradient {
  element = document.createElementNS(SVG_NS, "linearGradient");

  private stops: SVGStopElement[] = [];

  constructor({ animationDuration, stops, namespace }: SkeletonConfig) {
    this.element.id = `${namespace}-gradient-${Identity.next()}`;

    this.stops = this.createStops(stops);
    this.appendStops();

    setAttributes(this.element, {
      x1: "-200%",
      x2: "-100%",
      y1: "200%",
      y2: "100%",
    });

    const animateX1 = document.createElementNS(SVG_NS, "animate");
    const animateX2 = document.createElementNS(SVG_NS, "animate");
    const animateY1 = document.createElementNS(SVG_NS, "animate");
    const animateY2 = document.createElementNS(SVG_NS, "animate");

    setAttributes(animateX1, { attributeName: "x1", values: "-200%; 100%" });
    setAttributes(animateY1, { attributeName: "y1", values: "200%; -100%" });
    setAttributes(animateX2, { attributeName: "x2", values: "-100%; 200%" });
    setAttributes(animateY2, { attributeName: "y2", values: "100%; -200%" });

    const animations = [animateX1, animateX2, animateY1, animateY2];

    animations.forEach((x) => {
      setAttributes(x, {
        dur: `${animationDuration}ms`,
        repeatCount: "indefinite",
      });
      this.element.appendChild(x);
    });
  }

  private appendStops() {
    this.stops.forEach((el) => this.element.appendChild(el));
  }

  private createStops(stops: SkeletonConfig["stops"]) {
    return stops.map(({ color, offset }) => {
      const el = document.createElementNS(SVG_NS, "stop");
      setAttributes(el, {
        offset: `${offset * 100}%`,
        ["stop-color"]: color,
      });

      return el;
    });
  }

  updateStops(stops: SkeletonConfig["stops"]) {
    this.removeStops();
    this.stops = this.createStops(stops);
    this.appendStops();
  }

  private removeStops() {
    this.stops.forEach((el) => el.remove());
    this.stops = [];
  }
}
