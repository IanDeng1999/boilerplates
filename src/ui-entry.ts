import { alog } from "./shared/logger";

const data = require("./ui-commands.json");

data.forEach((command) => {
  const cmdName = `start:${command}`;
  ui.webView.jsBridge.handle(cmdName, (_event, msg) => {
    let args = {};

    try {
      alog(`运行${cmdName}，参数：${msg}`);
      args = JSON.parse(msg);
    } catch {
      args = {};
    }

    engines.execScriptFile(files.path(`./core/${command}.task.js`), {
      workingDirectory: files.path("./core"),
      arguments: args,
    });
    ui.run(() => activity.moveTaskToBack(true));
  });
});
