<template>
  <div class="relative z-20 flex items-center h-20 w-full bg-gray-500 text-white">
    <div class="w-1/4 pl-10">Typer</div>
    <div class="flex  items-center justify-evenly w-3/4">
      <div>Home</div>
      <NuxtLink to="/lessons">
        <div>Lessons</div>
      </NuxtLink>
      <NuxtLink to="/speedTest">
        <div>Speed test</div>
      </NuxtLink>
      <div>About us</div>
      <div class="flex justify-between ml-40">
        <button class="flex justify-center items-center rounded-md h-10 w-20 border border-gray-300 hover:bg-electric-violet-500 hover:border-none">Sign up</button>
        <button class="flex justify-center items-center rounded-md ml-5 h-10 w-20 bg-electric-violet-500">Login</button>
      </div>
    </div>
  </div>
  <slot />
</template>

<script setup>
</script>