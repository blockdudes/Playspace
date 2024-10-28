// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['w7.pngwing.com','tomato-characteristic-quail-246.mypinata.cloud','assets.nintendo.com','mediumrare.imgix.net','d2l63a9diffym2.cloudfront.net', 'static.keygames.com','play-lh.googleusercontent.com','www.cbc.ca','c4.wallpaperflare.com','assets.nintendo.com', 'images.unsplash.com', 'i.pinimg.com', 'encrypted-tbn0.gstatic.com','cdn5.vectorstock.com', 'i.ytimg.com', 'www.jopi.com', 'img.poki-cdn.com', 'images.crazygames.com' , 'www.crazygames.com','img2.tapimg.net'], 
  },
  webpack(config: any) {
    config.module.rules.push({
      test: /\.(wav|mp3)$/i,
      type: 'asset/source', 
    });

    return config;
  },
};

module.exports = nextConfig;
