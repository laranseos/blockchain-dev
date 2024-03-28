// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'static-testnet.unisat.io',
//         port: '',
//         pathname: '/preview/**',
//       },
//     ],
//   },
//   reactStrictMode: true,
// }

// module.exports = nextConfig


/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-testnet.unisat.io",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/unisat/:slug*",
        destination: "https://api.unisat.io/query-v4/brc20/:slug*",
      },
      {
        source: "/coinranking/:slug*",
        destination: "https://coinranking.com/api/:slug*", // api-coinranking
      },
      {
        source: "/api-coinranking/:slug*",
        destination: "https://api.coinranking.com/:slug*",
      },
      {
        source: "/mempool.space/api/:slug*",
        destination: "https://mempool.space/api/:slug*"
      },
      {
        source: "/blocks/:slug*",
        destination: "https://blockchain.info/:slug*",
      },
      {
        source: "/ipfs/:slug*",
        destination: "https://ipfs.io/ipfs/:slug*",
      },
      {
        source: "/1inch/:slug*",
        destination: "https://api.1inch.io/v5.0/:slug*",
      },
      {
        source: "/ordinalswallet/:slug*",
        destination: "https://turbo.ordinalswallet.com/:slug*",
      },
      {
        source: "/magiceden/:slug*",
        destination: "https://api-mainnet.magiceden.dev/:slug*"
      },
      {
        source: "/geniidata/:slug*",
        destination: "https://www.geniidata.com/:slug*"
      },
      {
        source: "/geniidata-api/:slug*",
        destination: "https://api.geniidata.com/api/:slug*"
      },
      {
        source: "/unisat-testnet/:slug*",
        destination: "https://api-testnet.unisat.io/wallet-v4/address/:slug*"
      }
    ];
  },
};

module.exports = nextConfig;