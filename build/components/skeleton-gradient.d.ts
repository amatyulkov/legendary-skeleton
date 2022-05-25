import { SkeletonConfig } from "../types/skeleton-config";
export declare class SkeletonGradient {
    element: SVGLinearGradientElement;
    private stops;
    constructor({ animationDuration, stops, namespace }: SkeletonConfig);
    private appendStops;
    private createStops;
    updateStops(stops: SkeletonConfig["stops"]): void;
    private removeStops;
}
