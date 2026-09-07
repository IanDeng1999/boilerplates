const status = require("statuses");

module.exports = function forbidden(extraData = status(403), code = 40300) {
  return this.res.status(403).json({
    code,
    err: extraData,
  });
};
