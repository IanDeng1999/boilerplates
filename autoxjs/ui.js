"ui";

ui.layout(
  <vertical w="*" h="*">
    <webview id="webView" w="*" h="*" />
  </vertical>,
);

const webSettings = ui.webView.getSettings();
webSettings.setAllowFileAccess(true);
ui.webView.loadUrl("file://" + files.path("./view/index.html"));

require("./ui/ui.js");
