<template>
  <div class="relative z-20 flex items-center h-20 w-full bg-gradient-to-r from-gray-500 to-gray-400 text-white">
    <div class="w-1/4 pl-10">Typer</div>
    <div class="flex  items-center justify-evenly w-2/4">
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
    <div v-show="user" class="w-1/4 flex justify-end pr-10">
      <button @click="logout()" class="flex justify-center items-center mr-5">
        <NuxtLink to="/">Logout</NuxtLink>
      </button>
      <NuxtLink to="/profile">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?flip=false&rotate=0&scale=100&size=64" class="h-12">
      </NuxtLink>
    </div>
    <div v-show="!user" class="w-1/4 flex justify-center">
      <NuxtLink to="/signup">
        <button
          class="flex justify-center items-center rounded-md h-10 w-20 border border-gray-300 hover:bg-electric-violet-500 hover:border-none">Sign
          up</button>
      </NuxtLink>
      <NuxtLink to="/login">
        <button class="flex justify-center items-center rounded-md ml-5 h-10 w-20 bg-electric-violet-500">Login</button>
      </NuxtLink>
    </div>
  </div>
  <slot />
</template>

<script setup>
const user = useCookie('user')

const logout = () => {
  user.value = null;
}
</script>