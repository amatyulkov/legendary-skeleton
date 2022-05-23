import { SkeletonShape } from "../types/skeleton-shape";
export declare class FillSkeleton implements SkeletonShape {
    private el;
    private rect;
    constructor(el: HTMLElement);
    sync(): void;
    getElements(): SVGRectElement[];
}
