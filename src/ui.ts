ui.webView.jsBridge.handle("toast-log", (_event, msg) => {
  // 申请权限
  toastLog(msg);
  engines.execScriptFile(files.path("./core/main.js"), {
    arguments: {
      message: msg,
    },
  });
  ui.run(() => activity.moveTaskToBack(true));
});
