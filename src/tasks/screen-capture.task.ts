import { BaseTask, type BaseTaskOptions } from "./base.task";

interface ScreenCaptureTaskOptions extends BaseTaskOptions {
  dir: string;
  fileName: string;
}

export class ScreenCaptureTask extends BaseTask<ScreenCaptureTaskOptions> {
  constructor(options: ScreenCaptureTaskOptions) {
    super(options);
  }

  public run(): boolean {
    let success = false;
    let screenshot: any;
    try {
      if (!requestScreenCapture()) {
        toastLog("未获得截图权限，终止执行");
        return true;
      }
      screenshot = captureScreen();
      files.ensureDir(this.options.dir);
      images.save(
        screenshot,
        files.join(this.options.dir, this.options.fileName),
        "png",
        100,
      );
      success = true;
    } finally {
      screenshot?.recycle();
    }
    return success;
  }

  name = "截图任务";
}
