module.exports = {
  datastores: {
    url: "postgres://postgres:unnamed.pass@127.0.0.1:5432/postgres",
  },
  custom: {
    redis: {
      host: "127.0.0.1",
      port: 6379,
      password: "unnamed.pass",
      db: 1,
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    },
  },
};
