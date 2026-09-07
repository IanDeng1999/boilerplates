const { isError } = require("es-toolkit");
const status = require("statuses");

module.exports = function serverError(extraData = status(500), code = 50000) {
  return this.res.status(500).json({
    code,
    err: isError(extraData) ? extraData.message : extraData,
  });
};
