module.exports = {
  apps: [
    {
      name: 'gemwizard',
      script: 'npm start',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      autorestart: true,
      watch: false,
      instance_var: 0,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
