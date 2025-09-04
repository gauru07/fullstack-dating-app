import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Backend server images (development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      // Backend server images (production - replace with your actual domain)
      ...(process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== 'http://localhost:3001' ? (() => {
        const url = new URL(process.env.NEXT_PUBLIC_API_URL);
        const pattern: any = {
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
        };
        if (url.port) {
          pattern.port = url.port;
        }
        return [pattern];
      })() : []),
      // External image sources
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "imljzgcuelzzzncfzlnc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "i.redd.it",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "media.gettyimages.com",
      },
    ],
  },
};

export default nextConfig;
