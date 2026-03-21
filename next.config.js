const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// next-pwa v5 is CJS-only; if migrating to ESM config, switch to @ducanh2912/next-pwa
module.exports = withPWA(nextConfig);
