import { alog } from "./shared/logger";
import { ScreenCaptureTask } from "./tasks/screen-capture.task";
import { TaskManager } from "./tasks/task-manager";

const args = engines.myEngine().execArgv;
const screenshotDir = String(context.getExternalFilesDir("unnamed"));

alog(`接收到运行参数: ${JSON.stringify(args)}`);

const taskManager = new TaskManager([
  new ScreenCaptureTask({
    runInterval: 1000,
    maxRunTime: 10,
    dir: screenshotDir,
    fileName: "screenshot.png",
  }),
]);

taskManager.bootstrap();
