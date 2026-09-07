module.exports.models = {
  schema: true,
  migrate: "safe",
  // migrate: "alter",
  attributes: {
    id: {
      type: "string",
      columnName: "id",
      columnType: "bigint",
      unique: true,
      required: true,
      allowNull: false,
    },
    createdAt: {
      columnName: "created_at",
      type: "number",
      autoCreatedAt: true,
    },
    updatedAt: {
      columnName: "updated_at",
      type: "number",
      autoUpdatedAt: true,
    },
  },

  dataEncryptionKeys: {
    default: "WaBivUCWWeEyTpAMOwrnDZ3BCBiiDaecrlcQfbWuP7E=",
  },

  cascadeOnDestroy: false,
};
