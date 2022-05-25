import { SkeletonShape } from "../types/skeleton-shape";
export declare class OutlineSkeleton implements SkeletonShape {
    private el;
    private outer;
    private inner;
    constructor(el: HTMLElement);
    getElements(): SVGRectElement[];
    sync(): void;
}
