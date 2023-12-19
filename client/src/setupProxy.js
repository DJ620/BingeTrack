const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // 👇️ make sure to update your target
      // target: 'http://localhost:8000/',
      target: "https://tv-tracker-4s31.onrender.com",
      changeOrigin: true,
    }),
  );
};