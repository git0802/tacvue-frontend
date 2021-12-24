/** @type {import('next').NextConfig} */
require("dotenv").config();
module.exports = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.API_KEY || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    ERC721_CONTRACT_ADDRESS: process.env.ERC721_CONTRACT_ADDRESS || "",
    MARKETPLACE_CONTRACT_ADDRESS: process.env.MARKETPLACE_CONTRACT_ADDRESS || "",
    PINATA_API_KEY: process.env.PINATA_API_KEY || "",
    PINATA_API_SECRET: process.env.PINATA_API_SECRET || "",
    NFT_STORAGE_TOKEN: process.env.NFT_STORAGE_TOKEN || "",
  },
  plugins: [["styled-components", { ssr: true }]],
  images: {
    domains: ["gateway.pinata.cloud", "dweb.link"],
  },
};
