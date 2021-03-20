module.exports = {
  devServer: {
    port: 8000,
    compress: true,
    proxy: {
      '^/': {
        target: 'https://testnet.bitmex.com',
        ws: true,
        changeOrigin: true
      },
    },
  },
}