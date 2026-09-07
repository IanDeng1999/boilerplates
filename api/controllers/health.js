module.exports = {
  friendlyName: "Health",
  description: "Health api.",
  inputs: {
    id: {
      type: "string",
      minLength: 0,
      required: true,
    },
  },
  fn: async (inputs, exits) => {
    console.log(inputs);
    return exits.ok("true");
  },
  exits: sails.config.http.resposne,
};
