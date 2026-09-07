module.exports = function ok(extraData, code = 400) {
  return this.res.json({
    code,
    data: extraData,
  });
};
