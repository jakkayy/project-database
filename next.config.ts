import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.nike.com", pathname: "/**" },
      { protocol: "https", hostname: "media.arirunningstore.com", pathname: "/**" },
      { protocol: "https", hostname: "www.footlocker.co.th", pathname: "/**" },
      { protocol: "https", hostname: "www.converse.co.th", pathname: "/**" },
      { protocol: "https", hostname: "run2paradise.com", pathname: "/**" },
      { protocol: "https", hostname: "www.nicekicks.com", pathname: "/**" },
      { protocol: "https", hostname: "vsathletics.com", pathname: "/**" },
      { protocol: "https", hostname: "www.central.co.th", pathname: "/**" },
      { protocol: "https", hostname: "underarmour.scene7.com", pathname: "/**" },
      { protocol: "https", hostname: "image.goxip.com", pathname: "/**" },
      { protocol: "https", hostname: "images.stockx.com", pathname: "/**" },
      { protocol: "https", hostname: "www.jdsports.co.th", pathname: "/**" },
    ],
  },
};

export default nextConfig;
