const path = require("node:path");

/**
 * Project model generator.
 *
 * Usage:
 *   pnpm exec sails generate model User name email:string:varchar isActive:boolean:boolean
 */
module.exports = {
  templatesDirectory: path.resolve(__dirname, "templates"),

  targets: {
    "./api/models/:filename": { template: "model.template" },
  },

  before(scope, proceed) {
    const [modelName, ...fieldArgs] = scope.args;

    if (!modelName) {
      return proceed.invalid(
        "Usage: sails generate model <ModelName> [name | name:type:columnType ...]",
      );
    }

    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(modelName)) {
      return proceed.invalid(
        "Model name must start with a letter and contain only letters, numbers, hyphens, or underscores.",
      );
    }

    const fields = [];
    const names = new Set();

    for (const fieldArg of fieldArgs) {
      const parts = fieldArg.split(":");
      const [name] = parts;
      const isDefaultStringField = parts.length === 1;
      const [type, columnType] = isDefaultStringField
        ? ["string", "string"]
        : parts.slice(1);

      if (
        (!isDefaultStringField && parts.length !== 3) ||
        !/^[A-Za-z][A-Za-z0-9_]*$/.test(name) ||
        !type ||
        !columnType
      ) {
        return proceed.invalid(
          `Invalid field \`${fieldArg}\`. Use name or name:type:columnType.`,
        );
      }

      if (!["string", "number", "boolean", "json", "ref"].includes(type)) {
        return proceed.invalid(
          `Unsupported Waterline type \`${type}\` for field \`${name}\`.`,
        );
      }

      if (["id", "createdAt", "updatedAt"].includes(name)) {
        return proceed.invalid(
          `Field \`${name}\` is generated automatically; do not declare it again.`,
        );
      }

      if (names.has(name)) {
        return proceed.invalid(`Duplicate field \`${name}\`.`);
      }

      names.add(name);
      fields.push({ name, type, columnType });
    }

    scope.globalId = toPascalCase(modelName);
    scope.filename = `${scope.globalId}.js`;
    scope.fields = fields;

    return proceed();
  },
};

function toPascalCase(value) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}
