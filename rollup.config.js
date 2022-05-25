import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "./src/index.ts",
  output: {
    dir: "build",
    format: "es",
  },
  plugins: [typescript(), nodeResolve()],
};
