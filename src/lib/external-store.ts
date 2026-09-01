type Listener = () => void;

/** Petit store externe compatible useSyncExternalStore, pour lire/écrire le localStorage sans setState-in-effect. */
export function createExternalStore<T>(load: () => T, serverValue: T) {
  let value: T = serverValue;
  let loaded = false;
  const listeners = new Set<Listener>();

  function ensureLoaded() {
    if (!loaded && typeof window !== "undefined") {
      value = load();
      loaded = true;
    }
  }

  function getSnapshot(): T {
    ensureLoaded();
    return value;
  }

  function getServerSnapshot(): T {
    return serverValue;
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function set(next: T) {
    value = next;
    loaded = true;
    listeners.forEach((l) => l());
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}
