import {
  track,
  trigger,
  effect,
  flushJob,
  jobQueue,
  computed,
  watch,
} from "./utils/lib.mjs";

const data = {
  foo: 1,
  bar: 2,
};
let temp1, temp2;

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    return trigger(target, key);
  },
});
const sumRes = watch(
  () => obj.foo,
  (n, o) => {
    console.log("数据变化", JSON.stringify(n), JSON.stringify(o));
  }
);

obj.foo++;
