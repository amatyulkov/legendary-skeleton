export interface SkeletonShape {
    getElements: () => SVGElement[];
    sync: () => void;
}
