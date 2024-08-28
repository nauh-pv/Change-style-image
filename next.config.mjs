/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/style_snap",
        destination: "/",
        permanent: true,
      },
    ];
  },
  // output: "export",
  webpack: (config) => {
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/image-style-transfer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
