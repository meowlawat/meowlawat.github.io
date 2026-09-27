import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  // GitHub Pages serves static files literally — trailingSlash ensures every
  // route exports as page/index.html (not page.html), which any static host
  // resolves correctly without needing extensionless-URL rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
