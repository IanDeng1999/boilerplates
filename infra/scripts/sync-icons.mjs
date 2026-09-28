import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const sourcePath = path.join(repositoryRoot, "resources/icon.png");

const targets = [
  // iOS
  ["ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png", 1024],

  // Android — launcher
  ["android/app/src/main/res/mipmap-mdpi/ic_launcher.png", 48],
  ["android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png", 48],
  ["android/app/src/main/res/mipmap-hdpi/ic_launcher.png", 72],
  ["android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png", 72],
  ["android/app/src/main/res/mipmap-xhdpi/ic_launcher.png", 96],
  ["android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png", 96],
  ["android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png", 144],
  ["android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png", 144],
  ["android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png", 192],
  ["android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png", 192],

  // Android — foreground
  ["android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png", 108],
  ["android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png", 162],
  ["android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png", 216],
  ["android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png", 324],
  ["android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png", 432],
];

// Check source exists first
const sourceOk = await access(sourcePath).then(
  () => true,
  () => false,
);
if (!sourceOk) {
  console.error("Source icon not found:", sourcePath);
  process.exit(1);
}

// Write each target, skipping those whose file doesn't exist
let synced = 0;
for (const [targetPath, size] of targets) {
  const fullPath = path.join(repositoryRoot, targetPath);
  if (
    !(await access(fullPath).then(
      () => true,
      () => false,
    ))
  ) {
    console.warn(`Skipping missing target: ${targetPath}`);
    continue;
  }
  await sharp(sourcePath)
    .flatten({ background: "#ffffff" })
    .resize(size, size, { fit: "fill" })
    .png()
    .toFile(fullPath);
  synced++;
}

console.log(`Synced ${synced} app icon files from resources/icon.png.`);
