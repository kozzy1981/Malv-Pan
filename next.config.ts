import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the assessment's hand-maintained AGENTS.md during local development.
  agentRules: false,
};

export default nextConfig;
