function configureNamedGenerator(scope, proceed, type, configure) {
  const [rawName, ...extraArgs] = scope.args;

  if (!rawName) {
    return proceed.invalid(`Usage: sails generate ${type} <name>`);
  }

  if (
    !/^[A-Za-z][A-Za-z0-9_-]*(?:[/.][A-Za-z][A-Za-z0-9_-]*)*$/.test(rawName)
  ) {
    return proceed.invalid(
      `${capitalize(type)} name must use letters, numbers, hyphens, underscores, dots, or slashes.`,
    );
  }

  const segments = rawName.replaceAll(".", "/").split("/").map(toKebabCase);
  scope.relPath = segments.join("/");
  scope.filename = `${scope.relPath}.js`;
  scope.friendlyName = toFriendlyName(segments.at(-1));
  scope.functionName = toCamelCase(segments.at(-1));

  if (configure) {
    const error = configure(scope, extraArgs);
    if (error) {
      return proceed.invalid(error);
    }
  } else if (extraArgs.length > 0) {
    return proceed.invalid(`Usage: sails generate ${type} <name>`);
  }

  return proceed();
}

function parseInputs(fieldArgs) {
  const fields = [];
  const names = new Set();

  for (const fieldArg of fieldArgs) {
    const [name, type, ...rest] = fieldArg.split(":");
    if (
      rest.length > 0 ||
      !/^[A-Za-z][A-Za-z0-9_]*$/.test(name) ||
      !isSupportedInputType(type)
    ) {
      return { error: `Invalid input \`${fieldArg}\`. Use name:type.` };
    }

    if (names.has(name)) {
      return { error: `Duplicate input \`${name}\`.` };
    }

    names.add(name);
    fields.push({ name, type });
  }

  return { fields };
}

function configureInputGenerator(scope, proceed, type) {
  return configureNamedGenerator(
    scope,
    proceed,
    type,
    (generatorScope, args) => {
      const result = parseInputs(args);
      generatorScope.inputs = result.fields;
      return result.error;
    },
  );
}

function configureResponseGenerator(scope, proceed) {
  return configureNamedGenerator(
    scope,
    proceed,
    "response",
    (generatorScope, args) => {
      const [statusCode] = args;
      const numericStatusCode = Number(statusCode);
      if (
        !/^\d{3}$/.test(statusCode || "") ||
        numericStatusCode < 100 ||
        numericStatusCode > 599
      ) {
        return "Response status must be a three-digit HTTP status code.";
      }

      generatorScope.statusCode = numericStatusCode;
    },
  );
}

function isSupportedInputType(type) {
  return ["string", "number", "boolean", "json", "ref"].includes(type);
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_-]+/g, "-")
    .toLowerCase();
}

function toCamelCase(value) {
  return value.replace(/-([a-z0-9])/g, (_, character) =>
    character.toUpperCase(),
  );
}

function toFriendlyName(value) {
  return capitalize(value.replaceAll("-", " "));
}

function capitalize(value) {
  return value[0].toUpperCase() + value.slice(1);
}

module.exports = {
  configureInputGenerator,
  configureNamedGenerator,
  configureResponseGenerator,
};
