module.exports = {
  attributes: {
    name: {
      type: "string",
      columnName: "name",
      columnType: "varchar(255)",
      required: true,
      allowNull: false,
    },

    email: {
      type: "string",
      columnName: "email",
      columnType: "varchar(32)",
      required: false,
      allowNull: false,
    },

    phone: {
      type: "string",
      columnName: "phone",
      columnType: "varchar(32)",
      required: true,
      allowNull: false,
    },
  },
};
