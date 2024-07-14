<script setup>
const user = useCookie('user');
const logout = () => {
  user.value = null;
}
</script>
<template>
  <div
    class="text-sm relative z-20 flex items-center h-20 w-full bg-gradient-to-r from-gray-500 to-gray-400 text-white md:text-base">
    <div class="w-1/4 pl-6 md:pl-10">Typer</div>
    <div class="flex items-center justify-between w-5/12 md:w-2/4 md:justify-evenly">
      <NuxtLink to="/">
        <div>Home</div>
      </NuxtLink>
      <NuxtLink to="/lessons">
        <div>Lessons</div>
      </NuxtLink>
      <NuxtLink v-if="user" to="/report">
        <div>Report</div>
      </NuxtLink>
    </div>
    <div v-if="user" class="w-1/3 flex justify-end pr-5 md:pr-10 md:w-1/4">
      <button @click="logout()" class="flex justify-center items-center mr-5">
        <NuxtLink to="/">Logout</NuxtLink>
      </button>
      <NuxtLink to="/profile">
        <img :src="`https://avatar.iran.liara.run/public/${user.avatarIndex}`" class="h-10 rounded-lg md:h-12" />
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
