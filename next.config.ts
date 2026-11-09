import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the assessment's hand-maintained AGENTS.md during local development.
  agentRules: false,
  images: {
    // All supplied product images use this HTTPS host and two-segment path structure.
    // Restrict ports and query strings rather than allowing arbitrary remote URLs.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dam.malvernpanalytical.com",
        port: "",
        pathname: "/*/*",
        search: "",
      },
    ],
  },
};

export default nextConfig;
