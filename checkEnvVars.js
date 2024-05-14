/** @param  {...string} requiredEnvVars */
const checkEnvVars = (...requiredEnvVars) => {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingVars.length) {
    const suffix = missingVars.length > 1 ? "s" : "";
    throw new Error(
      `Missing environment variable${suffix}: ${missingVars.join(", ")}`,
    );
  }
};

module.exports = checkEnvVars;
