module.exports = {
  apps: [
    {
      name: "unnamed",
      exec_interpreter: "node",
      script: "./dist/main.js",
      exec_mode: "cluster",
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: "1000M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
