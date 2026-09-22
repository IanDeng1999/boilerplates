import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const sourcePath = path.join(repositoryRoot, "resources/icon.png");

const targets = [
  {
    path: "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png",
    size: 1024,
  },
  ...[
    ["mdpi", 48],
    ["hdpi", 72],
    ["xhdpi", 96],
    ["xxhdpi", 144],
    ["xxxhdpi", 192],
  ].flatMap(([density, size]) => [
    {
      path: `android/app/src/main/res/mipmap-${density}/ic_launcher.png`,
      size,
    },
    {
      path: `android/app/src/main/res/mipmap-${density}/ic_launcher_round.png`,
      size,
    },
  ]),
  ...[
    ["mdpi", 108],
    ["hdpi", 162],
    ["xhdpi", 216],
    ["xxhdpi", 324],
    ["xxxhdpi", 432],
  ].map(([density, size]) => ({
    path: `android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png`,
    size,
  })),
];

await Promise.all([
  access(sourcePath),
  ...targets.map(({ path: targetPath }) =>
    access(path.join(repositoryRoot, targetPath)),
  ),
]);

await Promise.all(
  targets.map(async ({ path: targetPath, size }) => {
    await sharp(sourcePath)
      .flatten({ background: "#ffffff" })
      .resize(size, size, { fit: "fill" })
      .png()
      .toFile(path.join(repositoryRoot, targetPath));
  }),
);

console.log(`Synced ${targets.length} app icon files from resources/icon.png.`);
