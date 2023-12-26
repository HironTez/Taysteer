const checkEnvVars = () => {
  const requiredEnvVars = ["DATABASE_URL", "AUTH_SECRET"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing environment variable: ${envVar}`);
      process.exit(1);
    }
  }
};

module.exports = checkEnvVars;
