import type { NextConfig } from "next";
import path from "path";

const DEFAULT_API_ORIGIN = "http://127.0.0.1:4000";

function normalizeApiOrigin(value: string): string {
  const normalized = value.trim().replace(/\/+$/, "");

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(
      `API_INTERNAL_URL must be an absolute URL. Received "${value}".`
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("API_INTERNAL_URL must use http or https.");
  }

  return normalized;
}

const configuredApiOrigin = process.env.API_INTERNAL_URL?.trim();

if (process.env.VERCEL === "1" && !configuredApiOrigin) {
  throw new Error(
    "API_INTERNAL_URL must be configured for Vercel deployments. " +
      "Set it to the public origin of the Vraunix API, for example https://api.example.com."
  );
}

const apiOrigin = normalizeApiOrigin(configuredApiOrigin ?? DEFAULT_API_ORIGIN);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

if (process.env.VERCEL_ENV === "production") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@vraunix/shared"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "."),
    };
    return config;
  },
  experimental: {
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js"],
      ".mjs": [".mts", ".mjs"],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
