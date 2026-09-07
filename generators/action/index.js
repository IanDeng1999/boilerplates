const path = require("node:path");
const { configureInputGenerator } = require("../naming");

module.exports = {
  templatesDirectory: path.resolve(__dirname, "templates"),
  targets: {
    "./api/controllers/:filename": { template: "action.template" },
  },
  before(scope, proceed) {
    return configureInputGenerator(scope, proceed, "action");
  },
};
