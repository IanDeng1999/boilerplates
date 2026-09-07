const { logger } = require("./log");

module.exports.http = {
  middleware: {
    order: [
      "cookieParser",
      "session",
      "bodyParser",
      "compress",
      "poweredBy",
      "pino",
      "router",
      "www",
      "favicon",
    ],
    bodyParser: (function _configureBodyParser() {
      var skipper = require("skipper");
      var middlewareFn = skipper({ strict: true });
      return middlewareFn;
    })(),
    pino: (() => {
      return require("pino-http")({
        logger: logger,

        customSuccessMessage(req, res) {
          return `${req.method} ${req.url} ${res.statusCode}`;
        },
        customLogLevel(req, res, err) {
          if (!req.path.startsWith("/api") || res.statusCode === 404) {
            return "silent";
          }
          if (err || res.statusCode >= 500) {
            return "error";
          }

          if (res.statusCode >= 400) {
            return "warn";
          }

          return "success";
        },
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },

          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },

        customErrorMessage(req, res, err) {
          return `${req.method} ${req.url} ${res.statusCode} - ${err?.message}`;
        },
      });
    })(),
  },

  resposne: {
    ok: {
      responseType: "ok",
    },
  },
};
