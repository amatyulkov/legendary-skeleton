import { SkeletonShape } from "../types/skeleton-shape";
export declare class SkeletonPart {
    elements: SkeletonShape;
    constructor(el: HTMLElement);
    sync(): void;
}
