module.exports.blueprints = {
  actions: false,
  rest: true,
  shortcuts: false,
  prefix: "/api",
  parseBlueprintOptions: (req) => {
    var queryOptions = req._sails.hooks.blueprints.parseBlueprintOptions(req);

    // if (
    // 	req.options.blueprintAction === "find" ||
    // 	req.options.blueprintAction === "populate"
    // ) {
    // 	if (queryOptions.criteria.limit > 100) {
    // 		queryOptions.criteria.limit = 100;
    // 	}
    // }

    return queryOptions;
  },
};
