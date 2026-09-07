import mitt from "mitt";

type AppEvents = {
  "app:startup": undefined;
  "app:shutdown": undefined;
};

const emitter = mitt<AppEvents>();

export function clearAllEvents(): void {
  emitter.all.clear();
}

export default emitter;
