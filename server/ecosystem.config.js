module.exports = {
  apps: [
    {
      name: "pms",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
