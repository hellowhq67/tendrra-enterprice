/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        //optional port if needed
        //port: '3000',
        //optional path if needed
       // pathname: '/profile/**',
      },
        // You can add more remote patterns for different hostnames here
      
    ],
	//optional: output images in webp format
	formats: ['image/avif','image/webp'],
	
    // optional, if you have any problems loading a remote image
    unoptimized: false,
  },
  // any other config goes here
};

module.exports = nextConfig;