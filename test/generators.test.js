const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const generatorTypes = ["action", "response", "hook", "helper"];

for (const type of generatorTypes) {
  test(`${type} generator configures normalized names`, () => {
    const generator = require(`../generators/${type}`);
    const args =
      type === "response" ? ["admin/createUser", "403"] : ["admin/createUser"];
    const scope = { args };
    const result = runBefore(generator, scope);

    assert.equal(result, "proceed");
    assert.equal(scope.relPath, "admin/create-user");
    assert.equal(scope.filename, "admin/create-user.js");
    assert.equal(scope.friendlyName, "Create user");
  });

  test(`${type} generator rejects unsafe names`, () => {
    const generator = require(`../generators/${type}`);
    const result = runBefore(generator, { args: ["../secrets"] });

    assert.match(result, /name must use/i);
  });

  test(`${type} template includes its Sails entry point`, () => {
    const templatePath = path.join(
      __dirname,
      `../generators/${type}/templates/${type}.template`,
    );
    const template = fs.readFileSync(templatePath, "utf8");

    if (type !== "hook") {
      assert.match(template, /Generated with: pnpm exec sails generate/);
    }
    assert.match(template, /module\.exports/);
  });
}

for (const type of ["action", "helper"]) {
  test(`${type} generator parses typed inputs`, () => {
    const generator = require(`../generators/${type}`);
    const scope = { args: ["create-user", "name:string", "active:boolean"] };

    assert.equal(runBefore(generator, scope), "proceed");
    assert.deepEqual(scope.inputs, [
      { name: "name", type: "string" },
      { name: "active", type: "boolean" },
    ]);
  });

  test(`${type} generator rejects invalid typed inputs`, () => {
    const generator = require(`../generators/${type}`);

    assert.match(
      runBefore(generator, { args: ["create-user", "name:unknown"] }),
      /Invalid input/,
    );
  });
}

test("response generator requires a status code", () => {
  const generator = require("../generators/response");
  const scope = { args: ["forbidden", "403"] };

  assert.equal(runBefore(generator, scope), "proceed");
  assert.equal(scope.statusCode, 403);
  assert.match(
    runBefore(generator, { args: ["forbidden", "four-oh-three"] }),
    /three-digit HTTP status code/,
  );
  assert.match(
    runBefore(generator, { args: ["forbidden", "999"] }),
    /three-digit HTTP status code/,
  );
});

function runBefore(generator, scope) {
  let result;
  const proceed = () => {
    result = "proceed";
    return result;
  };

  proceed.invalid = (message) => {
    result = message;
    return message;
  };
  generator.before(scope, proceed);
  return result || "proceed";
}
