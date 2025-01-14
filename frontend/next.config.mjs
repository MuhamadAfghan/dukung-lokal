/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  // webServer: {
  //   hostname: "192.168.1.173",
  //   port: 3000,
  // },
  images: {
    remotePatterns: [
      {
        // protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL.replace(/"/g, ""),
        protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_BACKEND_HOSTNAME,
        port: process.env.NEXT_PUBLIC_BACKEND_PORT ?? "",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
