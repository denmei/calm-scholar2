/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { appDir: true },
    reactStrictMode: true,
    headers: async () => [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=()" }
        ]
      }
    ]
  };
  module.exports = nextConfig;
  