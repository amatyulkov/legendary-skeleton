import { Identity, setAttributes, SVG_NS } from "./lib";
import { SkeletonPart } from "./skeleton-part";
import { SkeletonConfig } from "./types/skeleton-config";

export class Skeleton {
  nodes: SkeletonPart[] = [];
  gradient: SVGLinearGradientElement;
  root: SVGElement;
  constructor(el = document.body) {
    this.nodes = [];

    const svg = document.createElementNS(SVG_NS, "svg");
    const mask = document.createElementNS(SVG_NS, "mask");
    const fill = document.createElementNS(SVG_NS, "rect");
    const defs = document.createElementNS(SVG_NS, "defs");
    const maskId = "maskId";
    const { scrollWidth, scrollHeight } = document.body;

    mask.id = maskId;

    const style = window.getComputedStyle(el);

    this.config.highlightWidth = style
      .getPropertyValue("--skeleton--highlight-width")
      .trim();
    this.config.animationDuration = style
      .getPropertyValue("--skeleton--animation-duration")
      .trim();
    this.gradient = this.createGradient();

    setAttributes(fill, {
      width: "100%",
      height: "100%",
      x: 0,
      y: 0,
      fill: `url(#${this.gradient.id})`,
      mask: `url(#${maskId})`,
    });

    svg.classList.add("skeleton__svg");
    svg.setAttribute("viewbox", `0 0 ${scrollWidth} ${scrollHeight}`);
    svg.appendChild(fill);
    svg.appendChild(mask);
    el.appendChild(svg);
    this.root = svg;
    defs.appendChild(this.gradient);
    this.root.appendChild(defs);
  }

  config: Partial<SkeletonConfig> = {};

  // TODO: to a separate class
  createGradient() {
    const gradient = document.createElementNS(SVG_NS, "linearGradient");
    const animateX1 = document.createElementNS(SVG_NS, "animate");
    const animateX2 = document.createElementNS(SVG_NS, "animate");
    const animateY1 = document.createElementNS(SVG_NS, "animate");
    const animateY2 = document.createElementNS(SVG_NS, "animate");

    const stopA = document.createElementNS(SVG_NS, "stop");
    const stopB = document.createElementNS(SVG_NS, "stop");
    const stopC = document.createElementNS(SVG_NS, "stop");

    const animations = [animateX1, animateX2, animateY1, animateY2];
    const stops = [stopA, stopB, stopC];
    const percent = parseFloat(this.config.highlightWidth || "50%"); // TODO: config should not be partial

    setAttributes(animateX1, { attributeName: "x1", values: "-200%; 100%" });
    setAttributes(animateY1, { attributeName: "y1", values: "200%; -100%" });
    setAttributes(animateX2, { attributeName: "x2", values: "-100%; 200%" });
    setAttributes(animateY2, { attributeName: "y2", values: "100%; -200%" });

    setAttributes(stopA, {
      offset: "0%",
      ["stop-color"]: "var(--skeleton--base)",
    });
    setAttributes(stopB, {
      offset: `${percent / 2}%`,
      ["stop-color"]: "var(--skeleton--highlight)",
    });
    setAttributes(stopC, {
      offset: `${percent}%`,
      ["stop-color"]: "var(--skeleton--base)",
    });

    gradient.id = `skeleton-gradient-${Identity.next()}`;

    // Safari needs initial values
    setAttributes(gradient, {
      x1: "-200%",
      x2: "-100%",
      y1: "200%",
      y2: "100%",
    });

    animations.forEach((x) => {
      setAttributes(x, {
        dur: this.config.animationDuration || "1000ms", // TODO: config should not be partial
        repeatCount: "indefinite",
      });
      gradient.appendChild(x);
    });
    stops.forEach((x) => gradient.appendChild(x));

    return gradient as SVGLinearGradientElement;
  }

  register(item: SkeletonPart) {
    this.nodes.push(item);
    item.elements.getElements().forEach((el) => {
      this.root.querySelector("mask")?.appendChild(el); // TODO: store mask definitely as non-optional
    });
    item.sync();
  }

  sync() {
    this.nodes.forEach((x) => x.sync());

    this.root.setAttribute(
      "viewbox",
      `0 0 ${document.body.scrollWidth} ${document.body.scrollHeight}`
    );
  }
}
