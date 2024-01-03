<script setup>
definePageMeta({
  layout: "header",
})
import { useMouse } from '@vueuse/core';

const {x, y} = useMouse()

</script>

<template>
  <div class="relative z-10 flex flex-col h-[87vh] pt-8 items-center">
    <h1 class="text-4xl">Welcome to <b class="text-electric-violet-500">Typer</b></h1>
    <div class="text-lg mt-8 text-center w-1/2">Start to learn and increase your 10 fingers typing and improve your skills for <b class="text-electric-violet-500">Free</b></div>
    <div class="mt-12">
      <NuxtLink to="/lessons">
        <button class="h-14 w-28 ml-10 rounded-lg bg-white border-2 border-electric-violet-500 hover:bg-electric-violet-500 hover:text-white">Get started</button>
      </NuxtLink>
      <NuxtLink to="/speedTest">
        <button class="h-14 w-28 ml-10 rounded-lg text-white bg-electric-violet-500">Speed test</button>
      </NuxtLink>
    </div>
    <img class="h-96" src="../assets/computer.png" />
  </div>
  <div 
    class="z-0 absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-3xl bg-electric-violet-500 rounded-full w-52 h-52"
    :style="{
      left: `${x}px`,
      top: `${y}px`
    }" >
  </div>
</template>

<style>
</style>