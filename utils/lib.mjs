let activeEffect;
const effectStack = [];
const bucket = new WeakMap();

export function effect(fn, options = {}) {
  const effectFn = () => {
    cleanUp(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

export function track(target, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }

  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

export function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun &&
    effectsToRun.forEach((effectFn) => {
      if (effectFn.options.scheduler) {
        effectFn.options.scheduler(effectFn);
      } else {
        effectFn();
      }
    });
  return true;
}

export function cleanUp(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

export const jobQueue = new Set();
const p = Promise.resolve();
let isFlushing = false;

export function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach((job) => job());
  }).finally(() => {
    isFlushing = false;
  });
}

export function computed(getters) {
  let value;
  let dirty = true;

  const effectFn = effect(getters, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, "value");
      }
    },
  });

  const obj = {
    get value() {
      if (dirty) {
        console.log("有值变化，重新计算");
        value = effectFn();
        dirty = false;
      }
      track(obj, "value");
      return value;
    },
  };
  return obj;
}

export function watch(source, cb) {
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  let oldValue, newValue;
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      newValue = effectFn();
      cb(newValue, oldValue);
      oldValue = newValue;
    },
  });
  oldValue = effectFn();
}

export function traverse(value, seen = new Set()) {
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
