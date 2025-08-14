/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Relax CORP to allow embedding of cross-origin resources like videos
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // Add CORS headers to allow requests to the S3 bucket
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://shotstack-api-stage-output.s3-ap-southeast-2.amazonaws.com',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      // Add S3 bucket for video loading
      {
        protocol: "https",
        hostname: "shotstack-api-stage-output.s3-ap-southeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
}

export default nextConfig