const path = require("node:path");
const { configureNamedGenerator } = require("../naming");

module.exports = {
  templatesDirectory: path.resolve(__dirname, "templates"),
  targets: {
    "./api/hooks/:relPath/index.js": { template: "hook.template" },
  },
  before(scope, proceed) {
    return configureNamedGenerator(scope, proceed, "hook");
  },
};
