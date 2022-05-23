import { Identity, setAttributes, SVG_NS } from "../lib";
import { SkeletonPart } from "./skeleton-part";
import { SkeletonConfig } from "../types/skeleton-config";
import { SkeletonGradient } from "./skeleton-gradient";

// TODO: all private methods are probably public component APIs
export class Skeleton {
  parts: SkeletonPart[] = [];

  root = document.createElementNS(SVG_NS, "svg");
  fill = document.createElementNS(SVG_NS, "rect");
  defs = document.createElementNS(SVG_NS, "defs");
  mask = document.createElementNS(SVG_NS, "mask");

  gradient: SkeletonGradient;
  config: SkeletonConfig;

  constructor(
    private el = document.body,config: Partial<SkeletonConfig> = {}
  ) {
    this.config = this.parseConfig(config);
    this.gradient = new SkeletonGradient(this.config);
    this.initMask();
    this.initFill();
    this.initRoot();
    this.initParts();
  }

  private initRoot () {
    const { scrollWidth, scrollHeight } = this.el;

    this.root.style.position = 'absolute';
    this.root.style.top = '0';
    this.root.style.left = '0';
    this.root.style.width = '100%';
    this.root.style.height = '100%';
    this.root.style.pointerEvents = 'none';

    this.root.setAttribute("viewbox", `0 0 ${scrollWidth} ${scrollHeight}`);
    this.root.appendChild(this.fill);
    this.root.appendChild(this.defs);
    this.defs.appendChild(this.mask);
    this.defs.appendChild(this.gradient.element);
    this.el.appendChild(this.root);
  }

  private initMask () {
    this.mask.id = `${this.config.namespace}-mask-${Identity.next()}`
  }

  private initFill () {
    setAttributes(this.fill, {
      width: "100%",
      height: "100%",
      x: 0,
      y: 0,
      fill: `url(#${this.gradient.element.id})`,
      mask: `url(#${this.mask.id})`,
    });
  }

  private initParts() {
    Array.from(
      document.querySelectorAll<HTMLElement>(this.config.partSelector)
    ).forEach((el) => {
      const part = new SkeletonPart(el);
      this.parts.push(part);
      part.elements
        .getElements()
        .forEach((shapeEl) => this.mask.appendChild(shapeEl));

      part.sync();
    });
  }

  private parseConfig(config: Partial<SkeletonConfig>): SkeletonConfig {
    const namespace = config.namespace ?? "skeleton";
    const color = config.color ?? "rgba(128, 128, 128, 0.1)";
    const highlight = config.highlight ?? "rgba(128, 128, 128, 0.2)";
    const highlightWidth = config.highlightWidth ?? 0.5;
    return {
      animationDuration: config.animationDuration ?? 1000,
      highlightWidth,
      namespace,
      partSelector: config.partSelector ?? `[data-${namespace}]`,
      color,
      highlight,
      stops: config.stops ?? [
        { offset: 0, color },
        { offset: highlightWidth / 2, color: highlight },
        { offset: highlightWidth, color },
      ],
    };
  }

  register(item: SkeletonPart) {
    this.parts.push(item);
    item.elements.getElements().forEach((el) => {
      this.mask.appendChild(el);
    });
    item.sync();
  }

  sync() {
    this.parts.forEach((x) => x.sync());

    this.root.setAttribute(
      "viewbox",
      `0 0 ${this.el.scrollWidth} ${this.el.scrollHeight}`
    );
  }
}
