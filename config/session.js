module.exports.session = {
  secret: "5edd14a9d9ca613fa599db1df43f9377",
  isSessionDisabled: (req) => !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX),
};
