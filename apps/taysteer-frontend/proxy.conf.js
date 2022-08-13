module.exports = {
  '/api': {
    target: `http://${process.env.HOST_BACKEND}:${process.env.PORT_BACKEND}`,
    secure: false,
  },
};
