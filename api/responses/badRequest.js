const status = require("statuses");

module.exports = function badRequest(extraData = status(400), code = 40000) {
  return this.res.status(400).json({
    code,
    err: extraData,
  });
};
