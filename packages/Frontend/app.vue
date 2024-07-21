<script setup lang="ts">
const { locale } = useI18n();
</script>

<template>
  <NuxtLayout>
    <NuxtPage :class="locale === 'en' ? 'font-nunito' : 'font-samim'" />
  </NuxtLayout>
  <UNotifications :class="locale === 'en' ? 'font-nunito' : 'font-samim'" :dir="locale === 'en' ? 'ltr' : 'rtl'" />
</template>

<style>
@font-face {
  font-family: 'Samim';
  src: url('./fonts/Samim/Samim-Medium.ttf');
}

@font-face {
  font-family: 'Nunito';
  src: url('./fonts/Nunito/static/Nunito-Medium.ttf');
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
