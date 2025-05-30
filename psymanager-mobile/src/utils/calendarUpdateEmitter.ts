type EventCallback = () => void;

const listeners = new Set<EventCallback>();

export const calendarUpdateEmitter = {
  subscribe: (callback: EventCallback) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  emit: () => {
    listeners.forEach((cb) => cb());
  },
};
