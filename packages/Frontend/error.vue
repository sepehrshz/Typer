<script setup lang="ts">
  const isHover = ref(false)
  const changeColor = (x : boolean) => {
    if (x) isHover.value = true
    else isHover.value = false
  }
</script>

<template>
  <div class="bg-white w-full h-[100vh] flex flex-col justify-center items-center ">
    <div class="w-[600px] bg-gradient-to-r from-electric-violet-500 from-20% to-electric-violet-400 p-10 rounded-2xl">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 786.94 294.29" style="enable-background:new 0 0 786.94 294.29;" xml:space="preserve">
        <path class="line anim" d="M151.13,226.53H26.2v-56.4L151.13,21.64h59.77v151.69h30.98v53.2h-30.98v46.13h-59.77V226.53z M151.13,173.33V95.65l-66.01,77.67H151.13z" />
        <path class="line anim" d="M669.99,226.53H545.07v-56.4L669.99,21.64h59.77v151.69h30.98v53.2h-30.98v46.13h-59.77V226.53z M669.99,173.33V95.65l-66.01,77.67H669.99z" />
        <path class="line anim" d="M393.47,80.81c36.58,0,66.34,29.76,66.34,66.34c0,36.58-29.76,66.34-66.34,66.34s-66.34-29.76-66.34-66.34C327.13,110.57,356.89,80.81,393.47,80.81 M393.47,21.81c-69.22,0-125.34,56.11-125.34,125.34s56.11,125.34,125.34,125.34s125.34-56.11,125.34-125.34S462.69,21.81,393.47,21.81L393.47,21.81z" />
      </svg>
    </div>
    <div class="h-40 flex justify-center items-center text-4xl">OOPS! Page not found</div>
    <button @mouseenter="() => changeColor(true)" @mouseleave="() => changeColor(false)" class="h-16 w-48 p-2 font-semibold border-2 border-electric-violet-500 rounded-xl hover:bg-gradient-to-r hover:from-electric-violet-500 hover:to-electric-violet-400 hover:border-none hover:text-white">
      Back to home page
      <Icon size="20px" name="formkit:arrowright" :color="isHover ? 'white' : 'black'"/>
    </button>
  </div>
</template>

<style>
::selection {
  background-color: #e600f9;
  color: white;
}

.line {
  fill: none;
  stroke: white;
  stroke-width: 12;
  stroke-dasharray: 200 100;
}

.anim {
  -webkit-animation: swirls 2s linear infinite;
  -moz-animation: swirls 2s linear infinite;
  -o-animation: swirls 2s linear infinite;
  animation: swirls 2s linear infinite;
}

@keyframes swirls {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 300;
  }
}
</style>