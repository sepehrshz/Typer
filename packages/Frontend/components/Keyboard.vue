<script setup lang="ts">
  const props = defineProps<{
    activeKey:string
  }>()
  
  let i = props.activeKey
  
  watch(props, ()=>{
    keys.value[i].isactive = false
    i = props.activeKey
    keys.value[props.activeKey].isactive = true
  })

  const keys = ref<{
    [S in string] :  {width?:number , isactive:boolean}
  }>({
  "1": {isactive:false},
  "2": {isactive:false},
  "3": {isactive:false},
  "4": {isactive:false},
  "5": {isactive:false},
  "6": {isactive:false},
  "7": {isactive:false},
  "8": {isactive:false},
  "9": {isactive:false},
  " 0": {isactive:false},
  "-": {isactive:false},
  "=": {isactive:false},
  "B Space": {isactive:false, width:70},
  "Tab": {isactive:false, width:70},
  "q": {isactive:false},
  "w": {isactive:false},
  "e": {isactive:false},
  "r": {isactive:false},
  "t": {isactive:false},
  "y": {isactive:false},
  "u": {isactive:false},
  "i": {isactive:false},
  "o": {isactive:false},
  "p": {isactive:false},
  "[": {isactive:false},
  "]": {isactive:false},
  "\\": {isactive:false},
  "Caps Lock": {isactive:false, width:85},
  "a": {isactive:false},
  "s": {isactive:false},
  "d": {isactive:false},
  "f": {isactive:false},
  "g": {isactive:false},
  "h": {isactive:false},
  "j": {isactive:false},
  "k": {isactive:false},
  "l": {isactive:false},
  ";": {isactive:false},
  "'": {isactive:false},
  "Enter": {isactive:false, width:77},
  "L Shift": {isactive:false, width:105},
  "z": {isactive:false},
  "x": {isactive:false},
  "c": {isactive:false},
  "v": {isactive:false},
  "b": {isactive:false},
  "n": {isactive:false},
  "m": {isactive:false},
  ",": {isactive:false},
  ".": {isactive:false},
  "/": {isactive:false},
  "R Shift": {isactive:false, width:105},
  " ": {isactive:false, width:300}
  })

  keys.value[props.activeKey].isactive = true
</script>

<template>
  <div class="flex flex-wrap justify-center w-full pt-3 pb-2 absolute z-0 left-1/2 -translate-x-1/2 top-5 rounded-md bg-slate-200">
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex bg-white justify-center items-center h-11 w-11 rounded-[2px]">`</div>
    </div>
    <div class="flex justify-center items-center p-[2px]" v-for="(item , key, index) in keys" :key="index">
      <div :class="[item.isactive && '!bg-electric-violet-300 border-[3px] border-electric-violet-600' ]" :style="{width:item.width + 'px'}" class="flex bg-white justify-center items-center h-11 w-11 rounded-[2px]">{{ key }}</div>
    </div>
    <!-- <div class="flex justify-center items-center p-[2px]">
      <div class="relative h-11 w-11 bg-white rounded-[2px]"><div class="absolute left-1/2 -translate-x-1/2">~</div><div class="absolute top-[18px] left-1/2 -translate-x-1/2">`</div></div>
    </div> -->
    <!-- <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">2</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">3</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">4</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">5</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">6</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">7</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">8</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">9</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">0</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">-</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">=</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[70px] bg-white rounded-[2px] text-sm">Backspace</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[70px] bg-white rounded-[2px]">Tab</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">Q</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">W</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">E</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">R</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">T</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">Y</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">U</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">I</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">O</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">P</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">[</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">]</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">\</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[85px] bg-white rounded-[2px] text-[13px]">Caps-lock</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">A</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">S</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">D</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">F</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">G</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">H</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">J</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">K</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">L</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">;</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">'</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[77px] bg-white rounded-[2px]">ENTER</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[105px] bg-white rounded-[2px]">Shift</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">Z</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">X</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">C</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">V</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">B</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">N</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">M</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">,</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">.</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-11 bg-white rounded-[2px]">/</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[105px] bg-white rounded-[2px]">Shift</div>
    </div>
    <div class="flex justify-center items-center p-[2px]">
      <div class="flex justify-center items-center h-11 w-[300px] bg-white rounded-[2px]"></div>
    </div> -->
  </div>
</template>

<style></style>
