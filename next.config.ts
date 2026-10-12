import type { NextConfig } from "next";
const sites = process.env.SITES_EXPORT === "1";
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  ...(sites
    ? { output: "export", distDir: ".next-sites", pageExtensions: ["tsx"] }
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                { key: "X-Frame-Options", value: "DENY" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }),
};
export default config;
