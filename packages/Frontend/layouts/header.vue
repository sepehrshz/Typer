<script setup>
const { t, locale } = useI18n();
const localePath = useLocalePath()

const user = useCookie('user');
const logout = () => {
  user.value = null;
}
</script>
<template>
  <div :class="locale === 'en' ? 'font-nunito' : 'font-samim'"
    class="text-sm relative z-20 flex items-center h-20 w-full bg-gradient-to-r from-gray-500 to-gray-400 text-white md:text-base">
    <div class="w-1/4 pl-6 md:pl-10">{{ t('typer') }}</div>
    <div :class="locale === 'en' ? 'flex-row' : 'flex-row-reverse'"
      class="flex items-start w-5/12 md:w-2/4 md:justify-evenly">
      <NuxtLink :to="localePath('/')">
        <div>{{ t('home') }}</div>
      </NuxtLink>
      <NuxtLink :to="localePath('/lessons')">
        <div class="ml-10 md:ml-0">{{ t('lessons') }}</div>
      </NuxtLink>
      <NuxtLink v-if="user" :to="localePath('/report')">
        <div class="ml-10 md:ml-0">{{ t('report') }}</div>
      </NuxtLink>
    </div>
    <div v-if="user" class="w-1/3 flex justify-end pr-5 md:pr-10 md:w-1/4">
      <button @click="logout()" class="flex justify-center items-center mr-5">
        <NuxtLink :to="localePath('/')">{{ t('logout') }}</NuxtLink>
      </button>
      <NuxtLink :to="localePath('/profile')">
        <img :src="`https://avatar.iran.liara.run/public/${user.avatarIndex}`" class="h-10 rounded-lg md:h-12" />
      </NuxtLink>
    </div>
    <div v-show="!user" class="w-1/4 flex justify-center">
      <NuxtLink :to="localePath('/signup')">
        <button
          class="flex justify-center items-center rounded-md h-10 w-20 border border-gray-300 hover:bg-primary hover:border-none">{{
            t('sign-up') }}</button>
      </NuxtLink>
      <NuxtLink :to="localePath('/login')">
        <button :class="locale === 'en' ? 'pb-0' : 'pb-1'"
          class="flex justify-center items-center rounded-md ml-5 h-10 w-20 bg-primary">{{
            t('login') }}</button>
      </NuxtLink>
    </div>
  </div>
  <slot />
</template>
