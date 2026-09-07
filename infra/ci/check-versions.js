#!/usr/bin/env node

/**
 * 检查package.json中的版本固定性
 * 确保所有依赖都使用精确版本号，而不是范围版本
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const packageJsonPath = path.join(process.cwd(), "package.json");

/**
 * 判断版本号是否为非精确版本（范围、通配符、比较运算符等）
 */
function isLooseVersion(version) {
  if (typeof version !== "string") {
    return false;
  }
  // 精确版本：纯数字加点号，如 "1.2.3"
  if (/^\d+\.\d+\.\d+$/.test(version)) {
    return false;
  }
  // URL / file / git 等协议版本，跳过检查
  if (/^(https?|git|file|workspace):/.test(version)) {
    return false;
  }
  return true;
}

/**
 * 检查单个依赖分组（dependencies / devDependencies 等）
 */
function checkDepGroup(deps, groupName, errors) {
  if (!deps) return;
  for (const [pkg, version] of Object.entries(deps)) {
    if (typeof version !== "string") {
      errors.push(
        `❌ ${groupName}.${pkg}: version is not a string (got ${typeof version})`,
      );
      continue;
    }
    if (isLooseVersion(version)) {
      errors.push(
        `❌ ${groupName}.${pkg}: "${version}" is not an exact version`,
      );
    }
  }
}

function checkVersions() {
  console.log("🔍 Checking package.json version constraints...");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const errors = [];

    // dependencies / devDependencies / optionalDependencies / bundledDependencies 必须精确版本
    checkDepGroup(packageJson.dependencies, "dependencies", errors);
    checkDepGroup(packageJson.devDependencies, "devDependencies", errors);
    checkDepGroup(
      packageJson.optionalDependencies,
      "optionalDependencies",
      errors,
    );
    checkDepGroup(
      packageJson.bundledDependencies,
      "bundledDependencies",
      errors,
    );

    // peerDependencies 允许 ^ / ~ 范围，但禁止 * / latest 等不稳定版本
    if (packageJson.peerDependencies) {
      for (const [pkg, version] of Object.entries(
        packageJson.peerDependencies,
      )) {
        if (typeof version !== "string") {
          errors.push(
            `❌ peerDependencies.${pkg}: version is not a string (got ${typeof version})`,
          );
          continue;
        }
        if (version === "*" || version === "latest") {
          errors.push(
            `❌ peerDependencies.${pkg}: "${version}" uses unstable version (* or latest)`,
          );
        }
      }
    }

    if (errors.length > 0) {
      console.error(`\n${errors.join("\n")}`);
      console.error(
        '\n💡 All package versions must use exact versions (e.g., "1.2.3")',
      );
      console.error(
        "   Avoid using ^1.2.3, ~1.2.3, >=1.0.0, 1.x, *, or latest",
      );
      return false;
    }

    console.log("✅ All package versions are properly fixed!");
    return true;
  } catch (error) {
    console.error(`❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

// 如果直接运行此脚本
const success = checkVersions();
process.exit(success ? 0 : 1);

export { checkVersions };
