<script setup lang="ts">
const props = defineProps<{
  activeKey: string
}>()

let i = props.activeKey

watch(props, () => {
  keys.value[i].isactive = false
  i = props.activeKey
  keys.value[props.activeKey].isactive = true
})

const keys = ref<{
  [S in string]: { width?: number, isactive: boolean }
}>({
  "1": { isactive: false },
  "2": { isactive: false },
  "3": { isactive: false },
  "4": { isactive: false },
  "5": { isactive: false },
  "6": { isactive: false },
  "7": { isactive: false },
  "8": { isactive: false },
  "9": { isactive: false },
  " 0": { isactive: false },
  "-": { isactive: false },
  "=": { isactive: false },
  "B Space": { isactive: false, width: 70 },
  "Tab": { isactive: false, width: 70 },
  "q": { isactive: false },
  "w": { isactive: false },
  "e": { isactive: false },
  "r": { isactive: false },
  "t": { isactive: false },
  "y": { isactive: false },
  "u": { isactive: false },
  "i": { isactive: false },
  "o": { isactive: false },
  "p": { isactive: false },
  "[": { isactive: false },
  "]": { isactive: false },
  "\\": { isactive: false },
  "Caps Lock": { isactive: false, width: 85 },
  "a": { isactive: false },
  "s": { isactive: false },
  "d": { isactive: false },
  "f": { isactive: false },
  "g": { isactive: false },
  "h": { isactive: false },
  "j": { isactive: false },
  "k": { isactive: false },
  "l": { isactive: false },
  ";": { isactive: false },
  "'": { isactive: false },
  "Enter": { isactive: false, width: 77 },
  "L Shift": { isactive: false, width: 105 },
  "z": { isactive: false },
  "x": { isactive: false },
  "c": { isactive: false },
  "v": { isactive: false },
  "b": { isactive: false },
  "n": { isactive: false },
  "m": { isactive: false },
  ",": { isactive: false },
  ".": { isactive: false },
  "/": { isactive: false },
  "R Shift": { isactive: false, width: 105 },
  " ": { isactive: false, width: 300 }
})

keys.value[props.activeKey].isactive = true
</script>

<template>
  <div
    class="flex flex-wrap justify-center w-full pt-3 pb-2 absolute z-0 left-1/2 -translate-x-1/2 top-5 rounded-md bg-slate-200">
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex bg-white justify-center items-center h-11 w-11 rounded-[2px]">`</div>
    </div>
    <div class="flex justify-center items-center p-[2px]" v-for="(item, key, index) in keys" :key="index">
      <div :class="[item.isactive && '!bg-primary-300 border-[3px] border-primary']"
        :style="{ width: item.width + 'px' }" class="flex bg-white justify-center items-center h-11 w-11 rounded-[2px]">
        {{
          key }}</div>
    </div>
  </div>
</template>

<style></style>
