import { GradientStop } from "./gradient-stop";

export type SkeletonConfig = {
  highlightWidth: number; // 0-1
  animationDuration: number; // ms
  namespace: string; // 'skeleton',

  // TODO: allow specifying part selector as function
  partSelector: string;

  color: string; // color value or CSS var
  highlight: string; // color value or CSS var,
  stops: GradientStop[]
};
