<script setup>
import { ref, watch, computed, reactive } from "vue";
// const msg = ref("initial value");
// const msg1 = ref("initial value");

// watch(
//   () => [msg.value, msg1.value],
//   (news, old) => {
//     console.log("news:", news);
//     console.log("old:", old);
//   }
// );

// // setTimeout(() => {
// msg.value = "changed";
// // }, 1000);

// // setTimeout(() => {
// Promise.resolve().then(() => (msg1.value = "changed"));
// // }, 2000);

const msg = reactive({
  text: "initial value",
  info: {
    name: "Tom",
  },
});

watch(msg.text, (news, old) => {
  console.log("news:", JSON.stringify(news));
  console.log("old:", JSON.stringify(old));
});

setTimeout(() => {
  msg.text = "changed";
}, 1000);

// setTimeout(() => {
//   msg.info = "text";
// }, 2000);

// setTimeout(() => {
//   msg.info.name = "Jhon";
// }, 1000);

// const obj = reactive({ count: 0 });

// this won't work because we are passing a number to watch()
// watch(obj.count, (count) => {
//   console.log(`count is: ${count}`);
// });

// setTimeout(() => {
//   obj.count++;
// }, 1000);
</script>

<template>
  <h1>{{ msg }}</h1>
</template>
