import { SkeletonPart } from "./skeleton-part";
import { SkeletonConfig } from "../types/skeleton-config";
export declare class Skeleton {
    private el;
    private parts;
    private root;
    private fill;
    private defs;
    private mask;
    private gradient;
    private config;
    private _isActive;
    get isActive(): boolean;
    private set isActive(value);
    constructor(el?: HTMLElement, config?: Partial<SkeletonConfig>);
    activate(): void;
    deactivate(): void;
    private initRoot;
    private initMask;
    private initFill;
    private initParts;
    private getPartNodes;
    private parseConfig;
    register(item: SkeletonPart): void;
    sync(): void;
}
