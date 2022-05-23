import { FillSkeleton } from "./fill-skeleton";
import { OutlineSkeleton } from "./outline-skeleton";
import { SkeletonShape } from "./types/skeleton-shape";

export class SkeletonPart {
  public elements: SkeletonShape;

  constructor(el: HTMLElement) {
    if (el.dataset.skeleton === "fill") {
      this.elements = new FillSkeleton(el);
    } else {
      this.elements = new OutlineSkeleton(el);
    }

    this.sync();
  }

  sync() {
    this.elements.sync();
  }
}
