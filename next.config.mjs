/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "source.unsplash.com",
      "cdn.sanity.io",
      "images.unsplash.com",
      "dk13n0ugcarh1.cloudfront.net",
      "ik.imagekit.io",
      "media.licdn.com",
      "www.investopedia.com",
      "www.pwc.com",
      "kangxiang.info",
      "www.netguru.com",
      "www.qross.no",
      "c4.wallpaperflare.com",
      "www.agile42.com",
      "www.netscribes.com",
      "www.oracle.com",
      "delhicourses.in",
      "www.bing.com",
      "dk13n0ugcarh1.cloudfront.net",
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
