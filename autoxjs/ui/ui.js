"use strict";

// src/ui.ts
ui.webView.jsBridge.handle("toast-log", (_event, msg) => {
  engines.execScriptFile(files.path("./core/main.js"), {
    workingDirectory: files.path("./core"),
    arguments: {
      message: msg
    }
  });
  ui.run(() => activity.moveTaskToBack(true));
});
//# sourceMappingURL=ui.js.map