import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Experimental: optimized package imports ────────────────────────────────
  // Prevents importing the ENTIRE package when only specific exports are used.
  // Reduces initial bundle size significantly for icon/chart libraries.
  experimental: {
    optimizePackageImports: [
      "lucide-react",      // Was importing all 1000+ icons; now tree-shaken
      "recharts",          // Large D3 dependency; now code-split per chart type
      "@tanstack/react-query",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-switch",
      "@radix-ui/react-separator",
      "@radix-ui/react-toast",
    ],
  },

  // ─── Images: optimize all <Image> tags ──────────────────────────────────────
  images: {
    // Use AVIF first (smaller), WebP fallback
    formats: ["image/avif", "image/webp"],
    // Prevent layout shifts: always require explicit width/height
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
  },

  // ─── Headers: aggressive caching & security ──────────────────────────────────
  async headers() {
    return [
      {
        // Cache static assets for 1 year (they're content-hashed)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Prevent clickjacking + XSS on all pages
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // ─── PoweredBy: hide framework fingerprint ──────────────────────────────────
  poweredByHeader: false,

  // ─── Webpack: manual chunk splitting for heavy libraries ────────────────────
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            // Recharts + D3 in own chunk (lazy-loaded only when charts visible)
            recharts: {
              test: /[\\/]node_modules[\\/](recharts|d3-.*|victory-.*)[\\/]/,
              name: "recharts",
              chunks: "async",   // async = only loaded when component renders
              priority: 20,
            },
            // jsPDF + xlsx only loaded when user triggers export
            exports: {
              test: /[\\/]node_modules[\\/](jspdf|xlsx|jspdf-autotable)[\\/]/,
              name: "export-libs",
              chunks: "async",
              priority: 20,
            },
            // All other vendor code — async only (prevents monolithic initial chunk)
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "async",
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
