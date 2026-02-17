import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  turbopack: {
    root: path.join(__dirname),
  },
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@azure/**", "./node_modules/tslib/**"],
  },
};

export default nextConfig;
