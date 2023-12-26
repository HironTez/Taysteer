const checkEnvVars = require("./checkEnvVars");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = () => {
  checkEnvVars();

  return nextConfig;
};
