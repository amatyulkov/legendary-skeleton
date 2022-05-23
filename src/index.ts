// TODO: maybe outlines can be just done with stroke?

type SvgAttrs = { [x: string]: string | number };

class SVG {
  static id = 0;
  static getId = () => SVG.id++;
  static create = (el: string) =>
    document.createElementNS("http://www.w3.org/2000/svg", el);

  static attr = (el: SVGElement, attrs: SvgAttrs) => {
    for (const attr in attrs) {
      el.setAttribute(
        attr,
        typeof attrs[attr] === "string"
          ? (attrs[attr] as string)
          : attrs[attr].toString()
      );
    }
  };

  static alignRect = (a: HTMLElement, b: SVGRectElement) => {
    const { width, height, top, left } = a.getBoundingClientRect();
    SVG.attr(b, {
      width: width.toString(),
      height: height.toString(),
      y: top.toString(),
      x: left.toString(),
    });
  };
}

interface SkeletonElements {
  getElements: () => SVGElement[];
  sync: () => void;
}

class FillSkeletonElements implements SkeletonElements {
  private rect: SVGRectElement = SVG.create("rect") as SVGRectElement;
  constructor(private el: HTMLElement) {
    this.rect.setAttribute("fill", "white");
  }

  sync() {
    const { borderRadius } = window.getComputedStyle(this.el);
    SVG.alignRect(this.el, this.rect);
    SVG.attr(this.rect, { rx: borderRadius, fill: "white" });
  }

  getElements() {
    return [this.rect];
  }
}

class OutlineSkeletonElements implements SkeletonElements {
  private outer: SVGRectElement = SVG.create("rect") as SVGRectElement;
  private inner: SVGRectElement = SVG.create("rect") as SVGRectElement;

  constructor(private el: HTMLElement) {
    SVG.attr(this.outer, { fill: "white" });
    SVG.attr(this.inner, { fill: "black" });
  }

  getElements() {
    return [this.outer, this.inner];
  }

  sync() {
    const style = window.getComputedStyle(this.el);
    const { top, left, width, height } = this.el.getBoundingClientRect();
    const radius = parseFloat(style.borderRadius) || 0;
    const outlineWidth = parseFloat(style.borderWidth) || 0;

    SVG.alignRect(this.el, this.outer);

    SVG.attr(this.outer, { rx: radius });
    SVG.attr(this.inner, {
      width: width - outlineWidth * 2,
      height: height - outlineWidth * 2,
      rx: radius - outlineWidth,
      x: left + outlineWidth,
      y: top + outlineWidth,
    });
  }
}

type SkeletonManagerConfig = {
  highlightWidth: string; // XXXpx YYYem
  animationDuration: string; // XXXms
}

class SkeletonManager {
  nodes: SkeletonItem[] = [];
  gradient: SVGLinearGradientElement;
  root: SVGElement;
  constructor(el = document.body) {
    this.nodes = [];

    const svg = SVG.create("svg");
    const mask = SVG.create("mask");
    const fill = SVG.create("rect");
    const defs = SVG.create("defs");
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

    SVG.attr(fill, {
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

  config: Partial<SkeletonManagerConfig> = {};

  createGradient() {
    const gradient = SVG.create("linearGradient");
    const animateX1 = SVG.create("animate");
    const animateX2 = SVG.create("animate");
    const animateY1 = SVG.create("animate");
    const animateY2 = SVG.create("animate");

    const stopA = SVG.create("stop");
    const stopB = SVG.create("stop");
    const stopC = SVG.create("stop");

    const animations = [animateX1, animateX2, animateY1, animateY2];
    const stops = [stopA, stopB, stopC];
    const percent = parseFloat(this.config.highlightWidth || '50%'); // TODO: config should not be partial

    SVG.attr(animateX1, { attributeName: "x1", values: "-200%; 100%" });
    SVG.attr(animateY1, { attributeName: "y1", values: "200%; -100%" });
    SVG.attr(animateX2, { attributeName: "x2", values: "-100%; 200%" });
    SVG.attr(animateY2, { attributeName: "y2", values: "100%; -200%" });

    SVG.attr(stopA, { offset: "0%", ["stop-color"]: "var(--skeleton--base)" });
    SVG.attr(stopB, {
      offset: `${percent / 2}%`,
      ["stop-color"]: "var(--skeleton--highlight)",
    });
    SVG.attr(stopC, {
      offset: `${percent}%`,
      ["stop-color"]: "var(--skeleton--base)",
    });

    gradient.id = `skeleton-gradient-${SVG.getId()}`;

    // Safari needs initial values
    SVG.attr(gradient, {
      x1: "-200%",
      x2: "-100%",
      y1: "200%",
      y2: "100%",
    });

    animations.forEach((x) => {
      SVG.attr(x, {
        dur: this.config.animationDuration || '1000ms', // TODO: config should not be partial
        repeatCount: "indefinite",
      });
      gradient.appendChild(x);
    });
    stops.forEach((x) => gradient.appendChild(x));

    return gradient as SVGLinearGradientElement;
  }

  register(item: SkeletonItem) {
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


class SkeletonItem {
  public elements: SkeletonElements;

  constructor(el: HTMLElement) {
    if (el.dataset.skeleton === "fill") {
      this.elements = new FillSkeletonElements(el);
    } else {
      this.elements = new OutlineSkeletonElements(el);
    }

    this.sync();
  }

  sync() {
    this.elements.sync();
  }
}

export { SkeletonManager, SkeletonItem };
