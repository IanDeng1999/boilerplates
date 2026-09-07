const { Snowflake } = require("@sapphire/snowflake");

const snowflakeIDGenerator = new Snowflake(
  new Date(sails.config.custom.SNOWFLAKE_TIME),
);

module.exports = {
  friendlyName: "Gen db id",

  description: "",

  inputs: {
    isString: {
      type: "boolean",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async (inputs, exits) => {
    const id = snowflakeIDGenerator.generate();
    return exits.success(inputs.isString ? id.toString() : id);
  },
};
