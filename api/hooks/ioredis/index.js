const Redis = require("ioredis");

module.exports = function defineIoredisHook(sails) {
  return {
    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async () => {
      const client = new Redis(sails.config.custom.redis);

      client.on("connect", () => {
        sails.log.info("ioredis: connected");
      });
      client.on("ready", () => {
        sails.log.info("ioredis: ready");
      });
      client.on("error", (err) => {
        sails.log.error("ioredis: error:", err.message);
      });
      client.on("close", () => {
        sails.log.warn("ioredis: connection closed");
      });
      client.on("reconnecting", (delay) => {
        sails.log.warn(`ioredis: reconnecting in ${delay}ms`);
      });

      // Expose the client to the rest of the app via `sails.ioredis`.
      sails.ioredis = client;

      sails.log.info("Initializing custom hook (`ioredis`)");
    },
  };
};
