import { GradientStop } from "./gradient-stop";

export type SkeletonConfig = {
  animationDuration: number; // ms
  namespace: string; // 'skeleton',

  // TODO: allow specifying part selector as function
  partSelector: string;
  stops: GradientStop[];
};
