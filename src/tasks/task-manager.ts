import { alog } from "@/shared/logger";
import type { BaseTask } from "./base.task";
import { TaskStatus } from "./task.const";

export class TaskManager {
  currentTaskIndex = -1;

  constructor(private tasks: BaseTask[]) {}

  getCurrentTask() {
    return this.tasks[this.currentTaskIndex];
  }

  bootstrap() {
    this.nextTask();
  }

  nextTask() {
    if (!this.tasks.length) {
      alog("本次执行没有任务");
    }
    if (this.currentTaskIndex + 1 >= this.tasks.length) {
      alog("本次脚本执行完成");
      return;
    }
    this.currentTaskIndex += 1;
    const task = this.getCurrentTask();
    alog(`开始任务: ${task.name}`);
    task.run();
    let runCount = 0;
    let timer: NodeJS.Timeout | null = setInterval(() => {
      const runResult = task.run();
      if (runResult) {
        timer && clearInterval(timer);
        timer = null;
        task.status = TaskStatus.DONE;
        alog(`完成任务：${task.name}`);
        this.nextTask();
      }
      if (++runCount > task.maxRunTime) {
        timer && clearInterval(timer);
        timer = null;
        task.status = TaskStatus.FAIL;
      }
    }, task.runInterval || 1000);
  }

  pause() {
    this.getCurrentTask().pause();
  }
}
