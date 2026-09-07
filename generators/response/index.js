const path = require("node:path");
const { configureResponseGenerator } = require("../naming");

module.exports = {
  templatesDirectory: path.resolve(__dirname, "templates"),
  targets: {
    "./api/responses/:filename": { template: "response.template" },
  },
  before(scope, proceed) {
    return configureResponseGenerator(scope, proceed);
  },
};
