const checkEnvVars = require("./checkEnvVars");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
};

module.exports = () => {
  checkEnvVars("DATABASE_URL", "AUTH_SECRET");

  return nextConfig;
};
