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
};

export default nextConfig;
