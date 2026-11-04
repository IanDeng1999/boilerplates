import { TaskStatus } from "./task.const";

export interface BaseTaskOptions {
  runInterval: number;
  maxRunTime: number;
}

export abstract class BaseTask<T extends BaseTaskOptions = BaseTaskOptions> {
  public abstract name: string;
  public status: TaskStatus = TaskStatus.PENDING;

  constructor(protected options: T) {}

  public abstract run(): boolean;

  get runInterval() {
    return this.options.runInterval;
  }

  get maxRunTime() {
    return this.options.maxRunTime;
  }

  public reset() {
    this.status = TaskStatus.PENDING;
  }

  public pause() {
    this.status = TaskStatus.PAUSED;
  }
}
