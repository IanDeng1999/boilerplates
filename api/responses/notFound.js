const status = require("statuses");

module.exports = function notFound(extraData = status(404), code = 40400) {
  return this.res.status(404).json({
    code,
    err: extraData,
  });
};
