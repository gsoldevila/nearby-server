module.exports = {
  apps: [{
      name: 'nearby-server-dev',
      script: 'server.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 16969
      }
    },
    {
      name: 'nearby-server-prod',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 6969
      }
    }
  ]
};
