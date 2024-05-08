/** @param  {...string} requiredEnvVars */
const checkEnvVars = (...requiredEnvVars) => {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingVars.length) {
    const wordEnding = missingVars.length > 1 ? "s" : "";
    throw new Error(
      `Missing environment variable${wordEnding}: ${missingVars.join(", ")}`,
    );
  }
};

module.exports = checkEnvVars;
