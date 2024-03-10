<template>
  <div class="relative z-20 flex items-center h-20 w-full bg-gradient-to-r from-gray-500 to-gray-400 text-white">
    <div class="w-1/4 pl-10">Typer</div>
    <div class="flex  items-center justify-evenly w-3/4">
      <NuxtLink to="/">
        <div>Home</div>
      </NuxtLink>
      <NuxtLink to="/lessons">
        <div>Lessons</div>
      </NuxtLink>
      <NuxtLink to="/speedTest">
        <div>Speed test</div>
      </NuxtLink>
      <div>About us</div>
    </div>
    <NuxtLink to="/profile">
      <img v-show="!user" :src="`https://avatar.iran.liara.run/username?username=${user.name}`" class="h-12">
    </NuxtLink>
    <div v-show="user" class="flex justify-between ml-40">
      <NuxtLink to="/signup"><button
          class="flex justify-center items-center rounded-md h-10 w-20 border border-gray-300 hover:bg-electric-violet-500 hover:border-none">Sign
          up</button></NuxtLink>
      <NuxtLink to="/login"><button
          class="flex justify-center items-center rounded-md ml-5 h-10 w-20 bg-electric-violet-500">Login</button>
      </NuxtLink>
    </div>
  </div>
  <slot />
</template>

<script setup>
const user = useCookie('user')
</script>