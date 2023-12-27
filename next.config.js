const checkEnvVars = require("./checkEnvVars");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
};

module.exports = () => {
  checkEnvVars();

  return nextConfig;
};
